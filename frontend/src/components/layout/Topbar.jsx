import { useState } from "react";
import Btn from "../ui/Btn.jsx";

const STATUS_TABS = [
  { id:"all",       label:"All" },
  { id:"active",    label:"Active" },
  { id:"completed", label:"Completed" },
];

const LABEL_CHIPS = [
  { value:"Work",       color:"#4F46E5", bg:"#EEF2FF" },
  { value:"Personal",   color:"#7C3AED", bg:"#F5F3FF" },
  { value:"Urgent",     color:"#E11D48", bg:"#FFF1F2" },
  { value:"Design",     color:"#D97706", bg:"#FFFBEB" },
  { value:"Development",color:"#0284C7", bg:"#F0F9FF" },
  { value:"Meeting",    color:"#059669", bg:"#ECFDF5" },
];

const SORT_LABELS = {
  dueDate:  "Due date",
  priority: "Priority",
  title:    "Title (A–Z)",
};

const PAGE_LABELS = {
  dashboard: "Dashboard",
  tasks:     "All tasks",
  "my-tasks":"My tasks",
  team:      "Team",
  profile:   "Profile",
};

export default function Topbar({ page, collapsed, setCollapsed, onNewTask, search, setSearch, filterPriority, setFilterPriority, filterStatus, setFilterStatus, filterTag, setFilterTag, sortBy, setSortBy }) {
  return (
    <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"0 22px",flexShrink:0}}>
      <div style={{height:56,display:"flex",alignItems:"center",gap:12}}>
        <button onClick={() => setCollapsed(p => !p)} style={{color:"#94A3B8",padding:4,borderRadius:6,border:"none",background:"none",cursor:"pointer"}}>
          <i className={`ti ${collapsed ? "ti-layout-sidebar-right" : "ti-layout-sidebar"}`} style={{fontSize:20}} aria-hidden="true" />
        </button>

        <h1 style={{fontSize:16,fontWeight:700,color:"#0F172A",marginRight:4}}>{PAGE_LABELS[page]}</h1>

        {(page === "tasks" || page === "my-tasks") && (
          <>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{height:34,width:"auto",fontSize:13,paddingRight:28,paddingLeft:10}}
            >
              <option value="default">Sort: Default</option>
              <option value="dueDate">Sort: Due date</option>
              <option value="priority">Sort: Priority</option>
              <option value="title">Sort: Title (A–Z)</option>
            </select>
            {sortBy !== "default" && (
              <span style={{fontSize:11,fontWeight:500,color:"#4F46E5",background:"#EEF2FF",padding:"4px 9px",borderRadius:12,display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>
                <i className="ti ti-arrows-sort" style={{fontSize:12}} aria-hidden="true" />
                Sorted by {SORT_LABELS[sortBy]}
              </span>
            )}
          </>
        )}

        {page === "tasks" && (
          <>
            <div style={{position:"relative",flex:1,maxWidth:320}}>
              <i className="ti ti-search" aria-hidden="true" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:14}} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…" style={{paddingLeft:32,height:34}} />
            </div>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              style={{height:34,width:"auto",fontSize:13,paddingRight:28,paddingLeft:10}}
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </>
        )}

        <div style={{flex:1}} />
        <Btn onClick={onNewTask} icon="ti-plus" title="Press N">New task</Btn>
      </div>

      {page === "tasks" && (
        <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10}}>
          <div style={{display:"flex",gap:4,background:"#F1F5F9",borderRadius:8,padding:3}}>
            {STATUS_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                style={{fontSize:12,fontWeight:filterStatus === tab.id ? 600 : 400,padding:"5px 14px",borderRadius:6,border:"none",background:filterStatus === tab.id ? "#fff" : "transparent",color:filterStatus === tab.id ? "#4F46E5" : "#64748B",cursor:"pointer",boxShadow:filterStatus === tab.id ? "0 1px 3px rgba(15,23,42,.08)" : "none",transition:"all .12s"}}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{width:1,height:18,background:"#E2E8F0"}} />
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            <button
              onClick={() => setFilterTag("all")}
              style={{fontSize:11,fontWeight:filterTag === "all" ? 600 : 400,padding:"4px 10px",borderRadius:14,border:`1.5px solid ${filterTag === "all" ? "#4F46E5" : "#E2E8F0"}`,background:filterTag === "all" ? "#EEF2FF" : "#fff",color:filterTag === "all" ? "#4F46E5" : "#64748B",cursor:"pointer",transition:"all .12s"}}
            >
              All labels
            </button>
            {LABEL_CHIPS.map(chip => {
              const active = filterTag === chip.value;
              return (
                <button
                  key={chip.value}
                  onClick={() => setFilterTag(active ? "all" : chip.value)}
                  style={{fontSize:11,fontWeight:active ? 600 : 400,padding:"4px 10px",borderRadius:14,border:`1.5px solid ${active ? chip.color : "#E2E8F0"}`,background:active ? chip.bg : "#fff",color:active ? chip.color : "#64748B",cursor:"pointer",transition:"all .12s"}}
                >
                  {chip.value}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}