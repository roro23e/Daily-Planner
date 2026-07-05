import { useState } from "react";
import { PRIORITY_CFG, STATUS_CFG } from "../../data/constants.js";
import { fmtDate, isOverdue } from "../../data/helpers.js";
import { PriorityBadge, Tag } from "../ui/Badges.jsx";
import { AvatarStack } from "../ui/Avatar.jsx";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onView, currentUser }) {
  const [hovered, setHovered] = useState(false);
  const ov = isOverdue(task.dueDate, task.status);
  const isAdmin  = currentUser?.role === "admin";
  const canEdit  = isAdmin || currentUser?.role === "manager" || task.createdBy === currentUser?.uid;
  const pm = PRIORITY_CFG[task.priority];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(task)}
      style={{background:"#fff",border:`1px solid ${hovered?"#CBD5E1":"#E2E8F0"}`,borderLeft:`3px solid ${pm.dot}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",marginBottom:10,transition:"border-color .15s, box-shadow .15s",boxShadow:hovered?"0 4px 16px rgba(15,23,42,.07)":"none"}}
    >
      {/* Title row */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:7}}>
        <p style={{fontSize:13,fontWeight:600,color:"#0F172A",lineHeight:1.45,flex:1,paddingRight:8}}>{task.title}</p>
        <div style={{display:"flex",gap:2,flexShrink:0,opacity:hovered?1:0,transition:"opacity .15s"}}>
          {canEdit && (
            <button onClick={e => {e.stopPropagation(); onEdit(task);}} style={{color:"#94A3B8",fontSize:14,padding:"2px 4px",borderRadius:5}} title="Edit">
              <i className="ti ti-edit" aria-hidden="true" />
            </button>
          )}
          {(isAdmin || task.createdBy === currentUser?.uid) && (
            <button onClick={e => {e.stopPropagation(); onDelete(task.id);}} style={{color:"#FDA4AF",fontSize:14,padding:"2px 4px",borderRadius:5}} title="Delete">
              <i className="ti ti-trash" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{fontSize:12,color:"#64748B",lineHeight:1.5,marginBottom:9,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{task.description}</p>
      )}

      {/* Badges */}
      <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:9}}>
        <PriorityBadge priority={task.priority} />
        {task.tags?.slice(0, 2).map(t => <Tag key={t} label={t} />)}
        {task.tags?.length > 2 && <span style={{fontSize:11,color:"#94A3B8"}}>+{task.tags.length - 2}</span>}
      </div>

      {/* Footer */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <AvatarStack uids={task.assignees} max={3} />
          {task.dueDate && (
            <span style={{fontSize:11,color:ov?"#E11D48":"#94A3B8",display:"flex",alignItems:"center",gap:3}}>
              <i className={`ti ti-${ov ? "alert-circle" : "calendar"}`} style={{fontSize:12}} aria-hidden="true" />
              {fmtDate(task.dueDate)}
            </span>
          )}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {task.commentCount > 0 && <span style={{fontSize:11,color:"#94A3B8",display:"flex",alignItems:"center",gap:3}}><i className="ti ti-message" style={{fontSize:12}} aria-hidden="true"/>{task.commentCount}</span>}
          {task.attachmentCount > 0 && <span style={{fontSize:11,color:"#94A3B8",display:"flex",alignItems:"center",gap:3}}><i className="ti ti-paperclip" style={{fontSize:12}} aria-hidden="true"/>{task.attachmentCount}</span>}
        </div>
      </div>

      {/* Quick-move buttons */}
      {hovered && task.status !== "done" && (
        <div onClick={e => e.stopPropagation()} style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
          {Object.entries(STATUS_CFG).filter(([k]) => k !== task.status).map(([k, v]) => (
            <button key={k} onClick={() => onStatusChange(task.id, k)} style={{fontSize:11,padding:"3px 9px",borderRadius:5,border:`1px solid ${v.accent}`,background:v.bg,color:v.color,fontWeight:600,cursor:"pointer"}}>
              → {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
