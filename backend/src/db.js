import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";
import { SEED_COMMENTS, SEED_GROUPS, SEED_TASKS, SEED_USERS } from "./constants.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localDbPath = path.join(__dirname, "localDb.json");

const hasFirebaseCredentials = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY,
);

let firestore = null;

if (hasFirebaseCredentials && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  firestore = admin.firestore();
}

const clone = value => JSON.parse(JSON.stringify(value));

const seedData = () => ({
  users: clone(SEED_USERS),
  tasks: clone(SEED_TASKS),
  groups: clone(SEED_GROUPS),
  comments: clone(SEED_COMMENTS),
});

const readLocal = async () => {
  const raw = await fs.readFile(localDbPath, "utf8");
  const db = JSON.parse(raw);
  if (!db.users.length && !db.tasks.length && !db.groups.length) return seedData();
  return db;
};

const writeLocal = db => fs.writeFile(localDbPath, JSON.stringify(db, null, 2) + "\n");

const listCollection = async collection => {
  const snapshot = await firestore.collection(collection).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const setCollectionDocument = (collection, id, data) =>
  firestore.collection(collection).doc(id).set(data, { merge: true });

const deleteCollectionDocument = (collection, id) =>
  firestore.collection(collection).doc(id).delete();

const makeId = prefix => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const usingFirestore = () => Boolean(firestore);

export const getWorkspace = async () => {
  if (!firestore) return readLocal();

  const [users, tasks, groups, commentsFlat] = await Promise.all([
    listCollection("users"),
    listCollection("tasks"),
    listCollection("groups"),
    listCollection("comments"),
  ]);

  const comments = commentsFlat.reduce((acc, comment) => {
    acc[comment.taskId] = [...(acc[comment.taskId] ?? []), comment];
    return acc;
  }, {});

  return { users, tasks, groups, comments };
};

export const seedWorkspace = async () => {
  const data = seedData();
  if (!firestore) {
    await writeLocal(data);
    return data;
  }

  await Promise.all([
    ...data.users.map(user => setCollectionDocument("users", user.uid, user)),
    ...data.tasks.map(task => setCollectionDocument("tasks", task.id, task)),
    ...data.groups.map(group => setCollectionDocument("groups", group.id, group)),
    ...Object.values(data.comments).flat().map(comment => setCollectionDocument("comments", comment.id, comment)),
  ]);
  return data;
};

export const findUserByEmail = async email => {
  const db = await getWorkspace();
  return db.users.find(user => user.email.toLowerCase() === email.toLowerCase()) ?? null;
};

export const saveUser = async user => {
  const { password, ...safeUser } = user;
  const saved = {
    ...safeUser,
    uid: user.uid ?? makeId("u"),
    isActive: user.isActive ?? true,
  };

  if (firestore) {
    await setCollectionDocument("users", saved.uid, saved);
    return saved;
  }

  const db = await readLocal();
  db.users = db.users.some(u => u.uid === saved.uid) ? db.users.map(u => u.uid === saved.uid ? saved : u) : [...db.users, saved];
  await writeLocal(db);
  return saved;
};

export const saveTask = async task => {
  const saved = { ...task, id: task.id ?? makeId("t") };
  if (firestore) {
    await setCollectionDocument("tasks", saved.id, saved);
    return saved;
  }

  const db = await readLocal();
  db.tasks = db.tasks.some(t => t.id === saved.id) ? db.tasks.map(t => t.id === saved.id ? saved : t) : [...db.tasks, saved];
  await writeLocal(db);
  return saved;
};

export const deleteTask = async id => {
  if (firestore) {
    const comments = await firestore.collection("comments").where("taskId", "==", id).get();
    await Promise.all([
      deleteCollectionDocument("tasks", id),
      ...comments.docs.map(doc => doc.ref.delete()),
    ]);
    return;
  }

  const db = await readLocal();
  db.tasks = db.tasks.filter(task => task.id !== id);
  delete db.comments[id];
  await writeLocal(db);
};

export const saveGroup = async group => {
  const saved = { ...group, id: group.id ?? makeId("g") };
  if (firestore) {
    await setCollectionDocument("groups", saved.id, saved);
    return saved;
  }

  const db = await readLocal();
  db.groups = db.groups.some(g => g.id === saved.id) ? db.groups.map(g => g.id === saved.id ? saved : g) : [...db.groups, saved];
  await writeLocal(db);
  return saved;
};

export const deleteGroup = async id => {
  if (firestore) {
    const workspace = await getWorkspace();
    await Promise.all([
      deleteCollectionDocument("groups", id),
      ...workspace.tasks.filter(task => task.groupId === id).map(task => saveTask({ ...task, groupId: null })),
    ]);
    return;
  }

  const db = await readLocal();
  db.groups = db.groups.filter(group => group.id !== id);
  db.tasks = db.tasks.map(task => task.groupId === id ? { ...task, groupId: null } : task);
  await writeLocal(db);
};

export const addComment = async (taskId, comment) => {
  const saved = { ...comment, id: comment.id ?? makeId("c"), taskId };
  if (firestore) {
    await setCollectionDocument("comments", saved.id, saved);
    return saved;
  }

  const db = await readLocal();
  db.comments[taskId] = [...(db.comments[taskId] ?? []), saved];
  db.tasks = db.tasks.map(task => task.id === taskId ? { ...task, commentCount: db.comments[taskId].length } : task);
  await writeLocal(db);
  return saved;
};

export const updateComment = async (taskId, id, body) => {
  if (firestore) {
    const ref = firestore.collection("comments").doc(id);
    await ref.set({ body, edited: true }, { merge: true });
    const saved = await ref.get();
    return { id: saved.id, ...saved.data() };
  }

  const db = await readLocal();
  db.comments[taskId] = (db.comments[taskId] ?? []).map(comment => comment.id === id ? { ...comment, body, edited: true } : comment);
  await writeLocal(db);
  return db.comments[taskId].find(comment => comment.id === id);
};

export const deleteComment = async (taskId, id) => {
  if (firestore) {
    await deleteCollectionDocument("comments", id);
    return;
  }

  const db = await readLocal();
  db.comments[taskId] = (db.comments[taskId] ?? []).filter(comment => comment.id !== id);
  db.tasks = db.tasks.map(task => task.id === taskId ? { ...task, commentCount: db.comments[taskId].length } : task);
  await writeLocal(db);
};
