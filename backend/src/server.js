import "dotenv/config";
import cors from "cors";
import express from "express";
import {
  addComment,
  deleteComment,
  deleteGroup,
  deleteTask,
  findUserByEmail,
  getWorkspace,
  saveGroup,
  saveTask,
  saveUser,
  seedWorkspace,
  updateComment,
  usingFirestore,
} from "./db.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

const asyncRoute = handler => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: usingFirestore() ? "firestore" : "local-json" });
});

app.get("/api/workspace", asyncRoute(async (req, res) => {
  res.json(await getWorkspace());
}));

app.post("/api/workspace/seed", asyncRoute(async (req, res) => {
  res.status(201).json(await seedWorkspace());
}));

app.post("/api/auth/login", asyncRoute(async (req, res) => {
  const user = await findUserByEmail(req.body.email ?? "");
  if (!user || !req.body.password) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }
  res.json(user);
}));

app.post("/api/auth/register", asyncRoute(async (req, res) => {
  const existing = await findUserByEmail(req.body.email ?? "");
  if (existing) {
    res.status(409).json({ message: "An account with this email already exists." });
    return;
  }
  const saved = await saveUser(req.body);
  res.status(201).json(saved);
}));

app.post("/api/tasks", asyncRoute(async (req, res) => {
  res.status(201).json(await saveTask(req.body));
}));

app.put("/api/tasks/:id", asyncRoute(async (req, res) => {
  res.json(await saveTask({ ...req.body, id: req.params.id }));
}));

app.delete("/api/tasks/:id", asyncRoute(async (req, res) => {
  await deleteTask(req.params.id);
  res.status(204).end();
}));

app.post("/api/groups", asyncRoute(async (req, res) => {
  res.status(201).json(await saveGroup(req.body));
}));

app.put("/api/groups/:id", asyncRoute(async (req, res) => {
  res.json(await saveGroup({ ...req.body, id: req.params.id }));
}));

app.delete("/api/groups/:id", asyncRoute(async (req, res) => {
  await deleteGroup(req.params.id);
  res.status(204).end();
}));

app.post("/api/tasks/:taskId/comments", asyncRoute(async (req, res) => {
  res.status(201).json(await addComment(req.params.taskId, req.body));
}));

app.put("/api/tasks/:taskId/comments/:id", asyncRoute(async (req, res) => {
  res.json(await updateComment(req.params.taskId, req.params.id, req.body.body));
}));

app.delete("/api/tasks/:taskId/comments/:id", asyncRoute(async (req, res) => {
  await deleteComment(req.params.taskId, req.params.id);
  res.status(204).end();
}));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Server error." });
});

app.listen(port, () => {
  console.log(`TaskFlow API running on http://localhost:${port}/api`);
});
