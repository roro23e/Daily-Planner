# TaskFlow — FERN Stack Task Management App

A full-featured task and team management application built on the **FERN** stack:
**F**irebase · **E**xpress · **R**eact · **N**ode.js

---

## Project structure

```
taskflow/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Root component — state, routing, global modals
    │
    ├── data/
    │   ├── constants.js                # Seed data, design tokens, config maps
    │   └── helpers.js                  # Pure utility functions (uid, fmtDate, userById…)
    │
    ├── hooks/
    │   ├── useToast.js                 # Toast notification state
    │   └── useGlobalStyle.js           # Injects global CSS on mount
    │
    ├── components/
    │   │
    │   ├── ui/                         # Reusable primitive UI components
    │   │   ├── Btn.jsx                 # Button (primary / secondary / danger / ghost)
    │   │   ├── Avatar.jsx              # Avatar + AvatarStack
    │   │   ├── Badges.jsx              # PriorityBadge, StatusPill, Tag, Badge, Spinner, EmptyState
    │   │   ├── FormFields.jsx          # Input, Textarea, Select wrappers
    │   │   ├── Modal.jsx               # Accessible modal shell (Escape key, backdrop click)
    │   │   ├── Toast.jsx               # Toast notification renderer
    │   │   └── AssigneePicker.jsx      # Searchable user picker with checkboxes + chip strip
    │   │
    │   ├── layout/                     # App shell components
    │   │   ├── Sidebar.jsx             # Collapsible sidebar with nav, groups, members
    │   │   └── Topbar.jsx              # Header with search, filter, New task button
    │   │
    │   ├── auth/                       # Authentication screens
    │   │   ├── LoginPage.jsx           # Split-panel login with demo account quick-fill
    │   │   └── RegisterPage.jsx        # Registration with field validation
    │   │
    │   ├── tasks/                      # Task-related components
    │   │   ├── TaskCard.jsx            # Kanban card with hover actions + quick-move
    │   │   ├── TaskModal.jsx           # Create / edit task modal
    │   │   ├── TaskDetailModal.jsx     # Task detail drawer (details + comments tabs)
    │   │   └── DeleteConfirm.jsx       # Delete confirmation modal
    │   │
    │   └── team/                       # Team & group components
    │       ├── GroupModal.jsx          # Create / edit group modal with colour picker + member picker
    │       ├── GroupTaskModal.jsx      # Assign task scoped to a group
    │       └── GroupDetailPanel.jsx    # Group detail with member strip + mini Kanban board
    │
    └── pages/                          # Full-page view components
        ├── Dashboard.jsx               # Welcome banner, stat cards, progress, workload
        ├── KanbanBoard.jsx             # 3-column Kanban board
        ├── MyTasks.jsx                 # Tasks assigned to the current user
        ├── TeamView.jsx                # Group list + detail panel + all-members overview
        └── Profile.jsx                 # User profile, stats, FERN stack card
```

---

## Quick start

### Prerequisites
- Node.js 18+
- npm 9+

### Install and run
```bash
cd taskflow
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production
```bash
npm run build
npm run preview
```

---

## Demo accounts

Click any account on the login screen to auto-fill credentials.
Any password works in the demo — just hit **Sign in**.

| Name          | Email                  | Role    |
|---------------|------------------------|---------|
| Alex Rivera   | alex@taskflow.io       | admin   |
| Jamie Santos  | jamie@taskflow.io      | manager |
| Morgan Lee    | morgan@taskflow.io     | member  |
| Taylor Kim    | taylor@taskflow.io     | member  |
| Casey Patel   | casey@taskflow.io      | member  |

---

## Features

### Authentication
- Login / register screens with validation
- Role-based UI (admin · manager · member)
- Demo quick-fill accounts on login screen

### Tasks
- **Kanban board** — To do / In progress / Done columns
- Create, edit, delete tasks with full modal form
- Priority levels (High / Medium / Low) with colour coding
- Due date with overdue warning
- Tags with comma-separated input
- Hover quick-move buttons on every card
- Task detail modal with **Details** + **Comments** tabs
- Comment thread — add, edit own, delete own
- Role-gated edit / delete (admin sees all, members see own)
- Search + priority filter on Kanban page

### Teams & Groups
- Create groups with name, description, colour, and member picker
- Edit and delete groups
- **Assign task to group** — task form scoped to group members only
- Group mini Kanban inside the detail panel
- All-members overview with workload stats and group badges

### Dashboard
- Welcome banner with active task count
- Stat cards: total, in-progress, completed, overdue
- Overall progress bar + status breakdown
- Team workload chart per user
- My tasks quick list
- Priority breakdown chart

### Profile
- User stats (my tasks, completed, completion rate)
- FERN stack reference card
- Sign out

---

## Connecting to a real backend

The app uses in-memory seed data. To connect to Firebase + Express:

1. Replace `src/data/constants.js` seed arrays with Firestore listeners
2. Swap `saveTask` / `deleteTask` / `changeStatus` in `App.jsx` with Express API calls
3. Replace the mock `login()` / `logout()` in `App.jsx` with `firebase/auth` methods
4. Add a `src/services/` folder for `api.js`, `auth.js`, `firestore.js`

### Recommended service layer structure
```
src/services/
├── api.js          # axios instance pointed at Express
├── auth.js         # Firebase Auth helpers
├── firestore.js    # Firestore collection helpers
└── storage.js      # Firebase Storage upload helpers
```

---

## Tech stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18 + Vite         |
| Styling   | Inline styles (token-based, no CSS framework) |
| Icons     | Tabler Icons (CDN webfont) |
| Backend   | Express.js + Node.js    |
| Auth      | Firebase Authentication |
| Database  | Firestore (NoSQL)       |
| Storage   | Firebase Storage        |
| Deploy    | Firebase Hosting + Cloud Functions |
