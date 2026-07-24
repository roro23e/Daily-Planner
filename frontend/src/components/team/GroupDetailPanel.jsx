import { USERS, STATUS_CFG, PRIORITY_CFG } from "../../data/constants.js";
import { fmtDate, isOverdue, buildShareText } from "../../data/helpers.js";
import Btn from "../ui/Btn.jsx";
import { PriorityBadge } from "../ui/Badges.jsx";
import { AvatarStack } from "../ui/Avatar.jsx";

export default function GroupDetailPanel({
  group, tasks,
  onClose, onEditGroup, onDeleteGroup, onAssignTask,
  onStatusChange, onViewTask, currentUser, users = USERS, toast,
}) {
  const groupTasks = tasks.filter(t => t.groupId === group.id);
  const members    = users.filter(u => group.memberIds.includes(u.uid));
  const isAdmin    = currentUser?.role === "admin";
  const isManager  = currentUser?.role === "manager";
  const canManage  = isAdmin || isManager || group.createdBy === currentUser?.uid;

  const shareGroup = async () => {
    const text = buildShareText(groupTasks, `${group.name} — task list`);
    try {
      await navigator.clipboard.writeText(text);
      toast?.show?.("Task list copied to clipboard", "success");
    } catch {
      window.location.href = `mailto:?subject=${encodeURIComponent(group.name + " task list")}&body=${encodeURIComponent(text)}`;
    }
  };

  return (
    <div className="anim-fade" style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column",flex:1,minHeight:0}}>

      {/* ── Header ── */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"flex-start",gap:14,flexShrink:0}}>
        <div style={{width:44,height:44,borderRadius:11,background:group.color+"20",border:`2px solid ${group.color}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <i className="ti ti-users" style={{fontSize:20,color:group.color}} aria-hidden="true" />
        </div>
        <div style={{flex:1,minWidth:0}}>
          <h2 style={{fontSize:17,fontWeight:700,color:"#0F172A",marginBottom:3}}>{group.name}</h2>
          {group.description && <p style={{fontSize:13,color:"#64748B"}}>{group.description}</p>}
          <div style={{display:"flex",alignItems:"center",gap:12,marginTop:6}}>
            <span style={{fontSize:12,color:"#94A3B8",display:"flex",alignItems:"center",gap:4}}>
              <i className="ti ti-users" style={{fontSize:13}} aria-hidden="true" />
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
            <span style={{fontSize:12,color:"#94A3B8",display:"flex",alignItems:"center",gap:4}}>
              <i className="ti ti-checklist" style={{fontSize:13}} aria-hidden="true" />
              {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
            </span>
            <span style={{fontSize:12,color:"#94A3B8"}}>Created {fmtDate(group.createdAt)}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,flexWrap:"wrap"}}>
          <Btn size="sm" variant="secondary" icon="ti-share" onClick={shareGroup}>Share list</Btn>
          <Btn size="sm" variant="primary" icon="ti-plus" onClick={() => onAssignTask(group)}>Assign task</Btn>
          {canManage && <Btn size="sm" variant="secondary" icon="ti-edit" onClick={() => onEditGroup(group)}>Edit</Btn>}
          {canManage && <Btn size="sm" variant="danger"    icon="ti-trash" onClick={() => onDeleteGroup(group.id)}>Delete</Btn>}
          <button onClick={onClose} style={{color:"#94A3B8",padding:"4px 6px",borderRadius:6,border:"1px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer",display:"flex",alignItems:"center"}}>
            <i className="ti ti-x" style={{fontSize:16}} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Members strip ── */}
      <div style={{padding:"12px 20px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",flexShrink:0}}>
        <span style={{fontSize:12,fontWeight:500,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".05em"}}>Members</span>
        {members.map(u => (
          <div key={u.uid} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 10px 4px 6px",borderRadius:20,background:u.color+"10",border:`1px solid ${u.color}25`}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:u.color+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:u.color}}>{u.initials}</div>
            <span style={{fontSize:12,fontWeight:500,color:u.color}}>{u.name.split(" ")[0]}</span>
            <span style={{fontSize:10,color:u.color+"88"}}>· {u.role}</span>
          </div>
        ))}
      </div>

      {/* ── Mini Kanban ── */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
        {groupTasks.length === 0 ? (
          <div style={{textAlign:"center",padding:"48px 20px"}}>
            <i className="ti ti-clipboard-list" style={{fontSize:40,color:"#CBD5E1",display:"block",marginBottom:12}} aria-hidden="true" />
            <p style={{fontSize:15,fontWeight:500,color:"#475569",marginBottom:4}}>No tasks assigned yet</p>
            <p style={{fontSize:13,color:"#94A3B8",marginBottom:16}}>Create the first task for this group.</p>
            <Btn icon="ti-plus" onClick={() => onAssignTask(group)}>Assign first task</Btn>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {Object.entries(STATUS_CFG).map(([key, col]) => {
              const colTasks = groupTasks.filter(t => t.status === key);
              return (
                <div key={key}>
                  {/* Column header */}
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10,padding:"7px 12px",background:col.bg,border:`1.5px solid ${col.accent}`,borderRadius:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:col.color,flexShrink:0}} />
                    <span style={{fontSize:12,fontWeight:700,color:col.color,flex:1}}>{col.label}</span>
                    <span style={{fontSize:11,fontWeight:700,background:col.accent+"88",color:col.color,padding:"1px 7px",borderRadius:9}}>{colTasks.length}</span>
                  </div>

                  {colTasks.length === 0 ? (
                    <div style={{textAlign:"center",padding:"20px 8px",border:"2px dashed #E2E8F0",borderRadius:8,color:"#CBD5E1",fontSize:12}}>No tasks</div>
                  ) : colTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => onViewTask(t)}
                      style={{background:"#F8FAFC",border:`1px solid #E2E8F0`,borderLeft:`3px solid ${PRIORITY_CFG[t.priority].dot}`,borderRadius:8,padding:"10px 12px",marginBottom:8,cursor:"pointer",transition:"background .15s, box-shadow .15s"}}
                      onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <p style={{fontSize:12,fontWeight:600,color:"#0F172A",marginBottom:6,lineHeight:1.4}}>{t.title}</p>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <PriorityBadge priority={t.priority} />
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <AvatarStack uids={t.assignees} max={2} />
                          {t.dueDate && (
                            <span style={{fontSize:10,color:isOverdue(t.dueDate,t.status)?"#E11D48":"#94A3B8",display:"flex",alignItems:"center",gap:2}}>
                              <i className="ti ti-calendar" style={{fontSize:11}} aria-hidden="true" />
                              {fmtDate(t.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Quick-move */}
                      <div onClick={e => e.stopPropagation()} style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
                        {Object.entries(STATUS_CFG).filter(([k]) => k !== key).map(([k, v]) => (
                          <button key={k} onClick={() => onStatusChange(t.id, k)} style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:`1px solid ${v.accent}`,background:v.bg,color:v.color,fontWeight:600,cursor:"pointer"}}>
                            → {v.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
