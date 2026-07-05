import Btn from "../ui/Btn.jsx";

const PAGE_LABELS = {
  dashboard: "Dashboard",
  tasks:     "All tasks",
  "my-tasks":"My tasks",
  team:      "Team",
  profile:   "Profile",
};

export default function Topbar({ page, collapsed, setCollapsed, onNewTask, search, setSearch, filterPriority, setFilterPriority }) {
  return (
    <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"0 22px",height:56,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
      <button onClick={() => setCollapsed(p => !p)} style={{color:"#94A3B8",padding:4,borderRadius:6,border:"none",background:"none",cursor:"pointer"}}>
        <i className={`ti ${collapsed ? "ti-layout-sidebar-right" : "ti-layout-sidebar"}`} style={{fontSize:20}} aria-hidden="true" />
      </button>

      <h1 style={{fontSize:16,fontWeight:700,color:"#0F172A",marginRight:4}}>{PAGE_LABELS[page]}</h1>

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
      <Btn onClick={onNewTask} icon="ti-plus">New task</Btn>
    </div>
  );
}
