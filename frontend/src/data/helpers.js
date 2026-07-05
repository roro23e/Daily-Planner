import { USERS } from "./constants.js";

export const uid     = () => Math.random().toString(36).slice(2, 10);
export const fmtDate = d  => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric" }) : "—";
export const isOverdue = (d, s) => d && new Date(d) < new Date() && s !== "done";
export const userById  = id => USERS.find(u => u.uid === id);
