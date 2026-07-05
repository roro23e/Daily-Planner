import { STATUS_CFG } from "../data/constants.js";
import { Badge } from "../components/ui/Badges.jsx";
import TaskCard from "../components/tasks/TaskCard.jsx";

export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange, onView, currentUser, onNewTask }) {
  return (
    <div style={{display:"flex",gap:18,overflowX:"auto",flex:1,paddingBottom:8,alignItems:"flex-start"}}>
      {Object.entries(STATUS_CFG).map(([key, col]) => {
        const colTasks = tasks.filter(t => t.status === key);
        return (
          <div key={key} style={{flex:"0 0 290px",display:"flex",flexDirection:"column"}}>
            {/* Column header */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,padding:"9px 14px",background:col.bg,border:`1.5px solid ${col.accent}`,borderRadius:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:col.color,flexShrink:0}} />
              <span style={{fontSize:13,fontWeight:700,color:col.color,flex:1}}>{col.label}</span>
              <Badge color={col.color} bg={col.accent + "88"}>{colTasks.length}</Badge>
            </div>

            {/* Cards */}
            <div style={{flex:1,overflowY:"auto",maxHeight:"calc(100vh - 220px)"}}>
              {colTasks.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onView={onView}
                  currentUser={currentUser}
                />
              ))}
              {colTasks.length === 0 && (
                <div style={{textAlign:"center",padding:"32px 16px",color:"#CBD5E1",border:"2px dashed #E2E8F0",borderRadius:10}}>
                  <i className="ti ti-clipboard-list" style={{fontSize:28,display:"block",marginBottom:8}} aria-hidden="true" />
                  <p style={{fontSize:12}}>No tasks here</p>
                </div>
              )}
            </div>

            {/* Add task quick-link (To do only) */}
            {key === "todo" && (
              <button
                onClick={onNewTask}
                style={{marginTop:8,padding:8,border:"1.5px dashed #CBD5E1",borderRadius:9,background:"transparent",color:"#94A3B8",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}
              >
                <i className="ti ti-plus" style={{fontSize:14}} aria-hidden="true" /> Add task
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
