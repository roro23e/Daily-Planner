// ─── Design tokens ────────────────────────────────────────────────────────────
export const T = {
  indigo:  { 50:"#EEF2FF", 100:"#E0E7FF", 200:"#C7D2FE", 400:"#818CF8", 600:"#4F46E5", 700:"#4338CA", 800:"#3730A3", 900:"#312E81" },
  slate:   { 50:"#F8FAFC", 100:"#F1F5F9", 200:"#E2E8F0", 300:"#CBD5E1", 400:"#94A3B8", 500:"#64748B", 600:"#475569", 700:"#334155", 800:"#1E293B", 900:"#0F172A" },
  emerald: { 50:"#ECFDF5", 100:"#D1FAE5", 400:"#34D399", 500:"#10B981", 600:"#059669", 700:"#047857" },
  amber:   { 50:"#FFFBEB", 100:"#FEF3C7", 400:"#FBBF24", 500:"#F59E0B", 600:"#D97706", 700:"#B45309" },
  rose:    { 50:"#FFF1F2", 100:"#FFE4E6", 400:"#FB7185", 500:"#F43F5E", 600:"#E11D48", 700:"#BE123C" },
  sky:     { 50:"#F0F9FF", 100:"#E0F2FE", 400:"#38BDF8", 500:"#0EA5E9", 600:"#0284C7", 700:"#0369A1" },
  violet:  { 50:"#F5F3FF", 100:"#EDE9FE", 400:"#A78BFA", 600:"#7C3AED", 700:"#6D28D9" },
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const SEED_USERS = [
  { uid:"u1", name:"Alex Rivera",  email:"alex@taskflow.io",   initials:"AR", color:T.indigo[600],  role:"admin"   },
  { uid:"u2", name:"Jamie Santos", email:"jamie@taskflow.io",  initials:"JS", color:T.emerald[600], role:"manager" },
  { uid:"u3", name:"Morgan Lee",   email:"morgan@taskflow.io", initials:"ML", color:T.violet[600],  role:"member"  },
  { uid:"u4", name:"Taylor Kim",   email:"taylor@taskflow.io", initials:"TK", color:T.amber[600],   role:"member"  },
  { uid:"u5", name:"Casey Patel",  email:"casey@taskflow.io",  initials:"CP", color:T.rose[600],    role:"member"  },
];

export const USERS = [...SEED_USERS];

export const setRuntimeUsers = users => {
  USERS.splice(0, USERS.length, ...users);
};

// ─── Seed tasks ───────────────────────────────────────────────────────────────
// ─── Seed projects ────────────────────────────────────────────────────────────
export const SEED_PROJECTS = [
  { id:"p1", name:"Internal Tools",   color:"#4F46E5" },
  { id:"p2", name:"Client — Acme Co", color:"#0284C7" },
  { id:"p3", name:"Client — Nova Inc",color:"#059669" },
];

export const SEED_TASKS = [
  { id:"t1", title:"Design login & register screens",  description:"Wireframes and high-fidelity mockups for the full auth flow including error states and mobile breakpoints.", priority:"high",   status:"done",        assignees:["u1","u2"], dueDate:"2026-06-18", tags:["design","auth"],     commentCount:3, attachmentCount:1, createdBy:"u1", createdAt:"2026-06-10" },
  { id:"t2", title:"Firebase Auth integration",        description:"Wire up email/password and Google OAuth. Handle token refresh and session persistence in localStorage.",      priority:"high",   status:"done",        assignees:["u2"],       dueDate:"2026-06-20", tags:["backend","auth"],    commentCount:5, attachmentCount:0, createdBy:"u1", createdAt:"2026-06-11" },
  { id:"t3", title:"Build Express REST API",           description:"CRUD endpoints for users and tasks. Middleware for Firebase token verification and RBAC.",                    priority:"high",   status:"in-progress", assignees:["u3","u4"], dueDate:"2026-06-28", tags:["backend","api"],     commentCount:2, attachmentCount:2, createdBy:"u2", createdAt:"2026-06-13" },
  { id:"t4", title:"Task assignment feature",          description:"Allow managers and admins to assign tasks to one or more team members. Trigger notifications on assignment.", priority:"high",   status:"in-progress", assignees:["u1"],       dueDate:"2026-06-27", tags:["feature"],           commentCount:7, attachmentCount:0, createdBy:"u1", createdAt:"2026-06-14" },
  { id:"t5", title:"Dashboard analytics",              description:"Display task completion rates, team workload distribution, and a burndown chart using Recharts.",             priority:"medium", status:"in-progress", assignees:["u2","u5"], dueDate:"2026-07-01", tags:["frontend","data"],   commentCount:1, attachmentCount:3, createdBy:"u2", createdAt:"2026-06-15" },
  { id:"t6", title:"Role-based access control",        description:"Implement admin / manager / member roles. Hide or disable UI affordances based on the current user's role.",  priority:"medium", status:"todo",        assignees:["u3"],       dueDate:"2026-07-03", tags:["backend","rbac"],    commentCount:0, attachmentCount:0, createdBy:"u1", createdAt:"2026-06-16" },
  { id:"t7", title:"Email notification system",        description:"Send emails when tasks are assigned, updated, or approaching their deadline. Use SendGrid via Cloud Function.",priority:"medium", status:"todo",        assignees:[],           dueDate:"2026-07-06", tags:["backend","notif"],   commentCount:0, attachmentCount:0, createdBy:"u2", createdAt:"2026-06-17" },
  { id:"t8", title:"Mobile responsive UI",             description:"Ensure the Kanban board, task modal, and sidebar collapse gracefully on screens below 768 px.",               priority:"low",    status:"todo",        assignees:["u4","u5"], dueDate:"2026-07-10", tags:["frontend","mobile"], commentCount:0, attachmentCount:1, createdBy:"u1", createdAt:"2026-06-18" },
  { id:"t9", title:"Write unit & integration tests",   description:"Target 80% coverage for Express routes and React components. Use Jest + React Testing Library.",              priority:"low",    status:"todo",        assignees:[],           dueDate:"2026-07-14", tags:["testing","quality"], commentCount:0, attachmentCount:0, createdBy:"u3", createdAt:"2026-06-19" },
];

// ─── Seed comments ────────────────────────────────────────────────────────────
export const SEED_COMMENTS = {
  t3: [
    { id:"c1", taskId:"t3", authorId:"u3", body:"Auth middleware is merged. Pushing endpoint stubs now.", edited:false, createdAt:"2026-06-22T11:15:00Z" },
    { id:"c2", taskId:"t3", authorId:"u1", body:"Looks solid — add rate limiting before the sprint demo.", edited:false, createdAt:"2026-06-22T14:30:00Z" },
  ],
  t4: [
    { id:"c3", taskId:"t4", authorId:"u2", body:"The assignee picker in the modal needs a search filter — 5+ users makes it unwieldy.", edited:false, createdAt:"2026-06-23T09:00:00Z" },
    { id:"c4", taskId:"t4", authorId:"u1", body:"Added. Also capped at 20 assignees to match Firestore array-contains limits.", edited:true,  createdAt:"2026-06-23T10:00:00Z" },
  ],
};

// ─── Seed groups ──────────────────────────────────────────────────────────────
export const SEED_GROUPS = [
  { id:"g1", name:"Backend team",  description:"Firebase, Express and Node engineers", color:"#4F46E5", memberIds:["u1","u2","u3"], createdBy:"u1", createdAt:"2026-06-10" },
  { id:"g2", name:"Frontend team", description:"React UI and design system owners",    color:"#059669", memberIds:["u1","u4","u5"], createdBy:"u1", createdAt:"2026-06-11" },
];

// ─── Priority config ──────────────────────────────────────────────────────────
export const PRIORITY_CFG = {
  high:   { label:"High",   dot:"#E11D48", bg:"#FFF1F2", text:"#BE123C", border:"#FECDD3" },
  medium: { label:"Medium", dot:"#D97706", bg:"#FFFBEB", text:"#B45309", border:"#FDE68A" },
  low:    { label:"Low",    dot:"#059669", bg:"#ECFDF5", text:"#047857", border:"#A7F3D0" },
};

// ─── Status config ────────────────────────────────────────────────────────────
export const STATUS_CFG = {
  "todo":        { label:"To do",       color:"#64748B", bg:"#F1F5F9", accent:"#CBD5E1" },
  "in-progress": { label:"In progress", color:"#0284C7", bg:"#F0F9FF", accent:"#BAE6FD" },
  "done":        { label:"Done",        color:"#059669", bg:"#ECFDF5", accent:"#A7F3D0" },
};

// ─── Group colour palette ─────────────────────────────────────────────────────
export const GROUP_PALETTE = [
  "#4F46E5","#7C3AED","#0284C7","#059669","#D97706","#E11D48","#0891B2","#65A30D",
];

// ─── Global CSS ───────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
body { background: #F8FAFC; color: #0F172A; -webkit-font-smoothing: antialiased; }
input, textarea, select, button { font-family: inherit; font-size: inherit; }
input, textarea, select {
  width: 100%; padding: 9px 12px; border: 1.5px solid #E2E8F0;
  border-radius: 8px; background: #fff; color: #0F172A; font-size: 14px;
  outline: none; transition: border-color .15s, box-shadow .15s;
}
input:focus, textarea:focus, select:focus {
  border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79,70,229,.12);
}
textarea { resize: vertical; line-height: 1.5; min-height: 80px; }
select { appearance: none; cursor: pointer; }
button { cursor: pointer; border: none; background: none; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
@keyframes fadeIn  { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:none} }
@keyframes scaleIn { from{opacity:0;transform:scale(.96)}        to{opacity:1;transform:none} }
@keyframes spin    { to{transform:rotate(360deg)} }
.anim-fade  { animation: fadeIn  .2s  ease both; }
.anim-scale { animation: scaleIn .18s ease both; }
`;
