import { useEffect, useState } from "react";
import { useGlobalStyle } from "./hooks/useGlobalStyle.js";
import { useToast } from "./hooks/useToast.js";
import { SEED_COMMENTS, SEED_GROUPS, SEED_TASKS, SEED_USERS, STATUS_CFG, setRuntimeUsers } from "./data/constants.js";
import { api } from "./services/api.js";

import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";

import LoginPage from "./components/auth/LoginPage.jsx";
import RegisterPage from "./components/auth/RegisterPage.jsx";

import TaskModal from "./components/tasks/TaskModal.jsx";
import TaskDetailModal from "./components/tasks/TaskDetailModal.jsx";
import DeleteConfirm from "./components/tasks/DeleteConfirm.jsx";

import Toast from "./components/ui/Toast.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import KanbanBoard from "./pages/KanbanBoard.jsx";
import MyTasksView from "./pages/MyTasks.jsx";
import TeamView from "./pages/TeamView.jsx";
import ProfileView from "./pages/Profile.jsx";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function App() {
  useGlobalStyle();

  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(SEED_USERS);
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [groups, setGroups] = useState(SEED_GROUPS);
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [page, setPage] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("default"); // "default" | "dueDate" | "priority" | "title"
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  const toast = useToast();

  const isDemoUser = !currentUser || SEED_USERS.some(user => user.uid === currentUser.uid);
  const visibleUsers = isDemoUser ? users : users.filter(user => user.uid === currentUser.uid);
  const visibleTasks = isDemoUser
    ? tasks
    : tasks.filter(task =>
        task.createdBy === currentUser.uid ||
        task.assignees?.includes(currentUser.uid)
      );
  const visibleGroups = isDemoUser
    ? groups
    : groups.filter(group =>
        group.createdBy === currentUser.uid ||
        group.memberIds?.includes(currentUser.uid)
      );

  useEffect(() => {
    let mounted = true;
    api.loadWorkspace()
      .then(data => {
        if (!mounted) return;
        setRuntimeUsers(data.users);
        setUsers(data.users);
        setTasks(data.tasks);
        setGroups(data.groups);
        setComments(data.comments);
      })
      .catch(() => toast.show("Could not load workspace data", "error"))
      .finally(() => mounted && setLoadingWorkspace(false));
    return () => { mounted = false; };
  }, []);

  // Keyboard shortcuts: "n" = new task, "/" = focus search
  useEffect(() => {
    const handler = e => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
      if (typing) return;

      if (e.key === "n" && !modal && !detailTask && screen === "app") {
        e.preventDefault();
        setModal("new");
      }
      if (e.key === "/" && screen === "app" && (page === "tasks" || page === "my-tasks")) {
        e.preventDefault();
        document.querySelector('input[placeholder="Search tasks…"]')?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal, detailTask, screen, page]);

  const login = user => {
    setCurrentUser(user);
    setPage("tasks");
    setScreen("app");
  };

  const register = user => {
    setUsers(prev => {
      const next = [...prev.filter(u => u.uid !== user.uid), user];
      setRuntimeUsers(next);
      return next;
    });
    setCurrentUser(user);
    setPage("tasks");
    setScreen("app");
  };

  const logout = () => {
    setCurrentUser(null);
    setScreen("login");
    setPage("dashboard");
  };

  const saveTask = async task => {
    const saved = await api.saveTask(task);
    setTasks(prev => prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved : x) : [...prev, saved]);
    return saved;
  };

  const deleteTask = async id => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setComments(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.show("Task deleted", "success");
  };

  const changeStatus = async (id, status) => {
    const current = tasks.find(t => t.id === id);
    if (!current) return;
    const saved = await api.saveTask({ ...current, status });
    setTasks(prev => prev.map(t => t.id === id ? saved : t));
    setDetailTask(prev => prev && prev.id === id ? { ...prev, status } : prev);
    toast.show("Moved to " + STATUS_CFG[status].label, "success");
  };

  const saveGroup = async group => {
    const saved = await api.saveGroup(group);
    setGroups(prev => prev.some(x => x.id === saved.id) ? prev.map(x => x.id === saved.id ? saved : x) : [...prev, saved]);
    return saved;
  };

  const deleteGroup = async id => {
    await api.deleteGroup(id);
    setGroups(prev => prev.filter(g => g.id !== id));
    setTasks(prev => prev.map(t => t.groupId === id ? { ...t, groupId: null } : t));
  };

  const addComment = async (taskId, comment) => {
    const saved = await api.addComment(taskId, comment);
    setComments(prev => ({ ...prev, [taskId]: [...(prev[taskId] ?? []), saved] }));
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, commentCount: (comments[taskId] ?? []).length + 1 } : t));
    return saved;
  };

  const updateComment = async (taskId, id, body) => {
    const saved = await api.updateComment(taskId, id, body);
    setComments(prev => ({ ...prev, [taskId]: (prev[taskId] ?? []).map(c => c.id === id ? saved : c) }));
  };

  const deleteComment = async (taskId, id) => {
    await api.deleteComment(taskId, id);
    setComments(prev => ({ ...prev, [taskId]: (prev[taskId] ?? []).filter(c => c.id !== id) }));
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, commentCount: Math.max((comments[taskId] ?? []).length - 1, 0) } : t));
  };

  const sortTasks = list => [...list].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0; // "default" — keep original order
  });

  const filteredTasks = sortTasks(
    visibleTasks.filter(t => {
      const q = search.toLowerCase();
      const matchQ = !q || t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q);
      const matchP = filterPriority === "all" || t.priority === filterPriority;
      const matchS = filterStatus === "all"
        || (filterStatus === "active" && t.status !== "done")
        || (filterStatus === "completed" && t.status === "done");
      const matchT = filterTag === "all" || (Array.isArray(t.tags) ? t.tags.includes(filterTag) : (t.tags ?? "").split(",").map(s => s.trim()).includes(filterTag));
      return matchQ && matchP && matchS && matchT;
    })
  );

  const sortedMyTasks = sortTasks(visibleTasks);

  if (loadingWorkspace) {
    return <div style={{height:"100vh",display:"grid",placeItems:"center",background:"#F8FAFC",color:"#64748B",fontSize:14}}>Loading workspace...</div>;
  }

  if (screen === "login") return <LoginPage users={users} onLogin={login} onGoRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterPage onRegister={register} onBack={() => setScreen("login")} />;

  return (
    <>
      <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"#F8FAFC"}}>
        <Sidebar
          page={page}
          setPage={setPage}
          currentUser={currentUser}
          tasks={visibleTasks}
          groups={visibleGroups}
          users={visibleUsers}
          collapsed={sidebarCollapsed}
        />

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <Topbar
            page={page}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            onNewTask={() => setModal("new")}
            search={search}
            setSearch={setSearch}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <div style={{flex:1,overflowY:"auto",padding:"22px 24px",display:"flex",flexDirection:"column"}}>
            {page === "dashboard" && (
              <Dashboard
                tasks={visibleTasks}
                currentUser={currentUser}
                users={visibleUsers}
                onNewTask={() => setModal("new")}
                setPage={setPage}
                groups={visibleGroups}
              />
            )}
            {page === "tasks" && (
              <KanbanBoard
                tasks={filteredTasks}
                onEdit={t => setModal(t)}
                onDelete={id => setDeleteTarget(id)}
                onStatusChange={changeStatus}
                onView={setDetailTask}
                currentUser={currentUser}
                onNewTask={() => setModal("new")}
              />
            )}
            {page === "my-tasks" && (
              <MyTasksView
                tasks={sortedMyTasks}
                currentUser={currentUser}
                onEdit={t => setModal(t)}
                onDelete={id => setDeleteTarget(id)}
                onStatusChange={changeStatus}
                onView={setDetailTask}
              />
            )}
            {page === "team" && (
              <TeamView
                tasks={visibleTasks}
                groups={visibleGroups}
                users={visibleUsers}
                onSaveGroup={saveGroup}
                onDeleteGroup={deleteGroup}
                currentUser={currentUser}
                onSaveTask={saveTask}
                toast={toast}
                onViewTask={setDetailTask}
                onStatusChange={changeStatus}
              />
            )}
            {page === "profile" && (
              <ProfileView currentUser={currentUser} tasks={visibleTasks} onLogout={logout} />
            )}
          </div>
        </div>
      </div>

      {(modal === "new" || modal?.id) && (
        <TaskModal
          task={modal === "new" ? null : modal}
          onSave={saveTask}
          onClose={() => setModal(null)}
          currentUser={currentUser}
          users={visibleUsers}
          toast={toast}
        />
      )}

      {detailTask && (
        <TaskDetailModal
          task={visibleTasks.find(t => t.id === detailTask.id) ?? detailTask}
          onClose={() => setDetailTask(null)}
          onEdit={t => { setDetailTask(null); setModal(t); }}
          onDelete={id => { setDeleteTarget(id); setDetailTask(null); }}
          currentUser={currentUser}
          comments={comments}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          onConfirm={() => deleteTask(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <Toast toasts={toast.toasts} dismiss={toast.dismiss} />
    </>
  );
}