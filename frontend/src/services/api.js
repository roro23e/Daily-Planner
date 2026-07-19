import { SEED_COMMENTS, SEED_GROUPS, SEED_TASKS, SEED_USERS } from "../data/constants.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const STORAGE_KEY = "taskflow.local-db.v1";

const clone = value => JSON.parse(JSON.stringify(value));

const defaultDb = () => ({
  users: clone(SEED_USERS),
  tasks: clone(SEED_TASKS),
  groups: clone(SEED_GROUPS),
  comments: clone(SEED_COMMENTS),
});

const readLocalDb = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultDb();
  return { ...defaultDb(), ...JSON.parse(saved) };
};

const writeLocalDb = db => localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(await response.text());
  if (response.status === 204) return null;
  return response.json();
};

const withFallback = async (remote, local) => {
  try {
    return await remote();
  } catch {
    return local();
  }
};

export const api = {
  loadWorkspace: () => withFallback(
    () => request("/workspace"),
    () => readLocalDb(),
  ),

  login: ({ email, password }) => withFallback(
    () => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    () => {
      const db = readLocalDb();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !password) throw new Error("Invalid email or password.");
      return user;
    },
  ),

  register: user => withFallback(
    () => request("/auth/register", { method: "POST", body: JSON.stringify(user) }),
    () => {
      const db = readLocalDb();
      if (db.users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const saved = { ...user, uid: user.uid ?? crypto.randomUUID(), role: "member", isActive: true };
      db.users.push(saved);
      writeLocalDb(db);
      return saved;
    },
  ),

  saveTask: task => withFallback(
    () => request(`/tasks${task.id ? `/${task.id}` : ""}`, { method: task.id ? "PUT" : "POST", body: JSON.stringify(task) }),
    () => {
      const db = readLocalDb();
      const saved = { ...task, id: task.id ?? crypto.randomUUID() };
      db.tasks = db.tasks.some(t => t.id === saved.id) ? db.tasks.map(t => t.id === saved.id ? saved : t) : [...db.tasks, saved];
      writeLocalDb(db);
      return saved;
    },
  ),

  deleteTask: id => withFallback(
    () => request(`/tasks/${id}`, { method: "DELETE" }),
    () => {
      const db = readLocalDb();
      db.tasks = db.tasks.filter(t => t.id !== id);
      delete db.comments[id];
      writeLocalDb(db);
    },
  ),

  saveGroup: group => withFallback(
    () => request(`/groups${group.id ? `/${group.id}` : ""}`, { method: group.id ? "PUT" : "POST", body: JSON.stringify(group) }),
    () => {
      const db = readLocalDb();
      const saved = { ...group, id: group.id ?? crypto.randomUUID() };
      db.groups = db.groups.some(g => g.id === saved.id) ? db.groups.map(g => g.id === saved.id ? saved : g) : [...db.groups, saved];
      writeLocalDb(db);
      return saved;
    },
  ),

  deleteGroup: id => withFallback(
    () => request(`/groups/${id}`, { method: "DELETE" }),
    () => {
      const db = readLocalDb();
      db.groups = db.groups.filter(g => g.id !== id);
      db.tasks = db.tasks.map(t => t.groupId === id ? { ...t, groupId: null } : t);
      writeLocalDb(db);
    },
  ),

  addComment: (taskId, comment) => withFallback(
    () => request(`/tasks/${taskId}/comments`, { method: "POST", body: JSON.stringify(comment) }),
    () => {
      const db = readLocalDb();
      const saved = { ...comment, id: comment.id ?? crypto.randomUUID(), taskId };
      db.comments[taskId] = [...(db.comments[taskId] ?? []), saved];
      db.tasks = db.tasks.map(t => t.id === taskId ? { ...t, commentCount: db.comments[taskId].length } : t);
      writeLocalDb(db);
      return saved;
    },
  ),

  updateComment: (taskId, id, body) => withFallback(
    () => request(`/tasks/${taskId}/comments/${id}`, { method: "PUT", body: JSON.stringify({ body }) }),
    () => {
      const db = readLocalDb();
      db.comments[taskId] = (db.comments[taskId] ?? []).map(c => c.id === id ? { ...c, body, edited: true } : c);
      writeLocalDb(db);
      return db.comments[taskId].find(c => c.id === id);
    },
  ),

  deleteComment: (taskId, id) => withFallback(
    () => request(`/tasks/${taskId}/comments/${id}`, { method: "DELETE" }),
    () => {
      const db = readLocalDb();
      db.comments[taskId] = (db.comments[taskId] ?? []).filter(c => c.id !== id);
      db.tasks = db.tasks.map(t => t.id === taskId ? { ...t, commentCount: db.comments[taskId].length } : t);
      writeLocalDb(db);
    },
  ),
};
