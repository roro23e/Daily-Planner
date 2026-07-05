import { STATUS_CFG } from "../data/constants.js";
import { EmptyState } from "../components/ui/Badges.jsx";
import TaskCard from "../components/tasks/TaskCard.jsx";

export default function MyTasksView({ tasks, currentUser, onEdit, onDelete, onStatusChange, onView }) {
  const mine = tasks.filter(t => t.assignees.includes(currentUser?.uid));

  if (mine.length === 0) {
    return (
      <div className="anim-fade">
        <EmptyState icon="ti-circle-check" title="No tasks assigned to you" sub="Your manager will assign tasks soon." />
      </div>
    );
  }

  return (
    <div className="anim-fade">
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
              <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} onView={onView} currentUser={currentUser} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
