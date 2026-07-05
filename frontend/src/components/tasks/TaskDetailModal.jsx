import { useState } from "react";
import { fmtDate, isOverdue, userById } from "../../data/helpers.js";
import { uid } from "../../data/helpers.js";
import Modal from "../ui/Modal.jsx";
import Btn from "../ui/Btn.jsx";
import { PriorityBadge, StatusPill, Tag } from "../ui/Badges.jsx";
import { AvatarStack } from "../ui/Avatar.jsx";

function CommentPanel({ taskId, currentUser, comments, onAddComment, onUpdateComment, onDeleteComment }) {
  const [body,     setBody]     = useState("");
  const [editId,   setEditId]   = useState(null);
  const [editBody, setEditBody] = useState("");
  const taskComments = comments[taskId] ?? [];

  const submit = async () => {
    if (!body.trim()) return;
    await onAddComment(taskId, { id:"c"+uid(), taskId, authorId:currentUser.uid, body:body.trim(), edited:false, createdAt:new Date().toISOString() });
    setBody("");
  };

  const saveEdit = async id => {
    if (!editBody.trim()) return;
    await onUpdateComment(taskId, id, editBody.trim());
    setEditId(null);
  };

  const del = id => onDeleteComment(taskId, id);

  return (
    <div>
      <div style={{marginBottom:12,display:"flex",flexDirection:"column",gap:10}}>
        {taskComments.length === 0 && (
          <p style={{fontSize:13,color:"#94A3B8",textAlign:"center",padding:"16px 0"}}>No comments yet. Be the first.</p>
        )}
        {taskComments.map(c => {
          const u = userById(c.authorId);
          return (
            <div key={c.id} className="anim-fade" style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:u?.color+"22",border:`1.5px solid ${u?.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:u?.color,flexShrink:0}}>{u?.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#0F172A"}}>{u?.name}</span>
                  {c.edited && <span style={{fontSize:11,color:"#94A3B8"}}>(edited)</span>}
                  <span style={{fontSize:11,color:"#CBD5E1",marginLeft:"auto"}}>{fmtDate(c.createdAt)}</span>
                </div>
                {editId === c.id ? (
                  <div>
                    <textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={2} style={{fontSize:13,marginBottom:6}} />
                    <div style={{display:"flex",gap:6}}>
                      <Btn size="sm" onClick={() => saveEdit(c.id)}>Save</Btn>
                      <Btn size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    <p style={{fontSize:13,color:"#334155",lineHeight:1.6,flex:1}}>{c.body}</p>
                    {c.authorId === currentUser.uid && (
                      <div style={{display:"flex",gap:4,flexShrink:0}}>
                        <button onClick={() => {setEditId(c.id); setEditBody(c.body);}} style={{color:"#94A3B8",fontSize:13,padding:2}} title="Edit">
                          <i className="ti ti-edit" aria-hidden="true" />
                        </button>
                        <button onClick={() => del(c.id)} style={{color:"#FDA4AF",fontSize:13,padding:2}} title="Delete">
                          <i className="ti ti-trash" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write a comment…" rows={2} style={{flex:1,fontSize:13}} onKeyDown={e => {if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();}} />
        <Btn size="sm" onClick={submit} disabled={!body.trim()} icon="ti-send">Send</Btn>
      </div>
    </div>
  );
}

export default function TaskDetailModal({ task, onClose, onEdit, onDelete, currentUser, comments, onAddComment, onUpdateComment, onDeleteComment }) {
  const ov      = isOverdue(task.dueDate, task.status);
  const [tab, setTab] = useState("details");
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isAdmin || currentUser?.role === "manager" || task.createdBy === currentUser?.uid;

  const Tab = ({ id, label, icon }) => (
    <button
      onClick={() => setTab(id)}
      style={{padding:"8px 14px",borderRadius:"6px 6px 0 0",border:"none",borderBottom:tab===id?"2px solid #4F46E5":"2px solid transparent",background:"transparent",color:tab===id?"#4F46E5":"#64748B",fontSize:13,fontWeight:tab===id?600:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}
    >
      <i className={`ti ${icon}`} style={{fontSize:14}} aria-hidden="true" /> {label}
    </button>
  );

  return (
    <Modal
      title={task.title}
      sub={`Created ${fmtDate(task.createdAt)}${task.createdBy ? ` · by ${userById(task.createdBy)?.name}` : ""}`}
      onClose={onClose}
      wide
      footer={<>
        {(isAdmin || task.createdBy === currentUser?.uid) && (
          <Btn variant="danger" icon="ti-trash" onClick={() => { onDelete(task.id); onClose(); }}>Delete</Btn>
        )}
        <div style={{flex:1}} />
        <Btn variant="secondary" onClick={onClose}>Close</Btn>
        {canEdit && <Btn icon="ti-edit" onClick={() => { onClose(); onEdit(task); }}>Edit task</Btn>}
      </>}
    >
      <div style={{display:"flex",gap:6,borderBottom:"1px solid #F1F5F9",marginBottom:16}}>
        <Tab id="details"  label="Details"                                 icon="ti-info-circle" />
        <Tab id="comments" label={`Comments (${(comments[task.id]??[]).length})`} icon="ti-message" />
      </div>

      {tab === "details" && (
        <div className="anim-fade">
          {task.description && (
            <div style={{background:"#F8FAFC",borderRadius:8,padding:"12px 14px",marginBottom:16,border:"1px solid #F1F5F9"}}>
              <p style={{fontSize:13,color:"#334155",lineHeight:1.7}}>{task.description}</p>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[
              { label:"Priority",    content:<PriorityBadge priority={task.priority} /> },
              { label:"Status",      content:<StatusPill status={task.status} /> },
              { label:"Due date",    content:<span style={{fontSize:13,color:ov?"#E11D48":"#334155",fontWeight:ov?600:400,display:"flex",alignItems:"center",gap:5}}>{ov&&<i className="ti ti-alert-circle" style={{fontSize:13}} aria-hidden="true"/>}{task.dueDate ? fmtDate(task.dueDate) : "Not set"}</span> },
              { label:"Assignees",   content:<AvatarStack uids={task.assignees} max={5} /> },
              { label:"Comments",    content:<span style={{fontSize:13,color:"#334155"}}>{(comments[task.id]??[]).length}</span> },
              { label:"Attachments", content:<span style={{fontSize:13,color:"#334155"}}>{task.attachmentCount}</span> },
            ].map(({ label, content }) => (
              <div key={label} style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",border:"1px solid #F1F5F9"}}>
                <p style={{fontSize:11,color:"#94A3B8",fontWeight:500,textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>{label}</p>
                {content}
              </div>
            ))}
          </div>
          {task.tags?.length > 0 && (
            <div>
              <p style={{fontSize:11,color:"#94A3B8",fontWeight:500,textTransform:"uppercase",letterSpacing:".05em",marginBottom:7}}>Tags</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{task.tags.map(t => <Tag key={t} label={t} />)}</div>
            </div>
          )}
        </div>
      )}

      {tab === "comments" && (
        <div className="anim-fade">
          <CommentPanel taskId={task.id} currentUser={currentUser} comments={comments} onAddComment={onAddComment} onUpdateComment={onUpdateComment} onDeleteComment={onDeleteComment} />
        </div>
      )}
    </Modal>
  );
}
