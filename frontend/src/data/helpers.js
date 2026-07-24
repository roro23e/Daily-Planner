import { USERS } from "./constants.js";

export const uid     = () => Math.random().toString(36).slice(2, 10);
export const fmtDate = d  => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric" }) : "—";
export const isOverdue = (d, s) => d && new Date(d) < new Date() && s !== "done";
export const userById  = id => USERS.find(u => u.uid === id);

export const buildShareText = (tasks, title = "Task list") => {
  const lines = tasks.map(t => {
    const who = t.assignees?.length ? t.assignees.map(id => userById(id)?.name).filter(Boolean).join(", ") : "Unassigned";
    return `• [${t.status.toUpperCase()}] ${t.title} — ${who}${t.dueDate ? ` (due ${fmtDate(t.dueDate)})` : ""}`;
  });
  return `${title} (${tasks.length} tasks)\n${lines.join("\n")}`;
};

export const isToday = iso => {
  if (!iso) return false;
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};
