import { STATUS_CFG } from "../data/constants.js";
import { EmptyState } from "../components/ui/Badges.jsx";
import TaskCard from "../components/tasks/TaskCard.jsx";
import { buildShareText } from "../data/helpers.js";

export default function MyTasksView({ tasks, currentUser, onEdit, onDelete, onStatusChange, onView, projects = [], toast }) {
  const mine = tasks.filter(t => t.assignees.includes(currentUser?.uid));

  const shareMine = async () => {
    const text = buildShareText(mine, `${currentUser?.name}'s tasks`);
    try {
      await navigator.clipboard.writeText(text);
      toast?.show?.("Task list copied to clipboard", "success");
    } catch {
      window.location.href = `mailto:?subject=My TaskFlow tasks&body=${encodeURIComponent(text)}`;
    }
  };

  if (mine.length === 0) {
    return (
      <div className="anim-fade">
        <EmptyState icon="ti-circle-check" title="No tasks assigned to you" sub="Your manager will assign tasks soon." />
      </div>
    );
  }

  return (
    <div className="anim-fade">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
        <button
          onClick={shareMine}
          style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:500,color:"#4F46E5",background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:8,padding:"6px 12px",cursor:"pointer"}}
        >
          <i className="ti ti-share" style={{fontSize:15}} aria-hidden="true" /> Share my tasks
        </button>
      </div>
      {Object.entries(STATUS_CFG).map(([k, v]) => {
        const col = mine.filter(t => t.status === k);
        if (!col.length) return null;
        return (
          <div key={k} style={{marginBottom:22}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:v.color}} />
              <span style={{fontSize:13,fontWeight:700,color:v.color}}>{v.label}</span>
              <span style={{fontSize:12,color:"#94A3B8"}}>({col.length})</span>
            </div>
            {col.map(t => (
              <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} onView={onView} currentUser={currentUser} projects={projects} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
