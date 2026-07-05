import { useState } from "react";
import { USERS } from "../../data/constants.js";
import { uid, userById } from "../../data/helpers.js";
import Modal from "../ui/Modal.jsx";
import Btn from "../ui/Btn.jsx";

export default function GroupTaskModal({ group, onSave, onClose, currentUser, users = USERS, toast }) {
  const [form, setForm] = useState({
    title:"", description:"", priority:"medium", status:"todo",
    assignees: group.memberIds.slice(0, 1), dueDate:"", tags:"",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [q,      setQ]      = useState("");

  const set  = k => v => setForm(p => ({...p, [k]: v}));
  const setE = k => e => set(k)(e.target.value);

  const groupUsers = users.filter(u =>
    group.memberIds.includes(u.uid) &&
    (!q || u.name.toLowerCase().includes(q.toLowerCase()))
  );

  const toggleA = id => set("assignees")(
    form.assignees.includes(id) ? form.assignees.filter(x => x !== id) : [...form.assignees, id]
  );

  const save = async () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 350));
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    await onSave({
      ...form,
      tags:           tagsArr,
      id:             "t" + uid(),
      groupId:        group.id,
      createdAt:      new Date().toISOString().split("T")[0],
      commentCount:   0,
      attachmentCount:0,
      createdBy:      currentUser?.uid,
    });
    toast.show("Task created and assigned to " + group.name, "success");
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      title="Assign task to group"
      sub={`Assigning within "${group.name}" · ${group.memberIds.length} members`}
      onClose={onClose}
      wide
      footer={<>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save} disabled={saving} icon={saving ? "ti-loader-2" : "ti-send"}>
          {saving ? "Saving…" : "Assign task"}
        </Btn>
      </>}
    >
      {/* Group banner */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:group.color+"10",border:`1.5px solid ${group.color}30`,borderRadius:9,marginBottom:18}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:group.color,flexShrink:0}} />
        <span style={{fontSize:13,fontWeight:600,color:group.color}}>{group.name}</span>
        {group.description && <span style={{fontSize:12,color:group.color+"aa",marginLeft:4}}>{group.description}</span>}
      </div>

      {/* Title */}
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Task title *</label>
        <input value={form.title} onChange={setE("title")} placeholder="What needs to be done?" autoFocus style={{borderColor:errors.title?"#F43F5E":undefined}} />
        {errors.title && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Description</label>
        <textarea value={form.description} onChange={setE("description")} placeholder="Context, requirements, acceptance criteria…" rows={3} />
      </div>

      {/* Priority / Status / Due */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
        <div>
          <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Priority</label>
          <div style={{position:"relative"}}>
            <select value={form.priority} onChange={setE("priority")} style={{paddingRight:32}}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <i className="ti ti-chevron-down" aria-hidden="true" style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#94A3B8",pointerEvents:"none"}} />
          </div>
        </div>
        <div>
          <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Status</label>
          <div style={{position:"relative"}}>
            <select value={form.status} onChange={setE("status")} style={{paddingRight:32}}>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <i className="ti ti-chevron-down" aria-hidden="true" style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#94A3B8",pointerEvents:"none"}} />
          </div>
        </div>
        <div>
          <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Due date</label>
          <input type="date" value={form.dueDate} onChange={setE("dueDate")} />
        </div>
      </div>

      {/* Tags */}
      <div style={{marginBottom:18}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Tags</label>
        <input value={form.tags} onChange={setE("tags")} placeholder="api, auth, frontend  (comma-separated)" />
      </div>

      {/* Assignees — group members only */}
      <div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <label style={{fontSize:13,fontWeight:500,color:"#334155"}}>Assign to group members</label>
          <span style={{fontSize:12,color:"#94A3B8"}}>{form.assignees.length} of {group.memberIds.length} selected</span>
        </div>
        <div style={{position:"relative",marginBottom:8}}>
          <i className="ti ti-search" aria-hidden="true" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:14}} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter members…" style={{paddingLeft:32}} />
        </div>
        <div style={{border:"1.5px solid #E2E8F0",borderRadius:10,overflow:"hidden",maxHeight:200,overflowY:"auto"}}>
          {groupUsers.map((u, i) => {
            const sel = form.assignees.includes(u.uid);
            return (
              <div key={u.uid} onClick={() => toggleA(u.uid)} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 13px",cursor:"pointer",background:sel?group.color+"0f":"#fff",borderTop:i>0?"1px solid #F1F5F9":"none"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:u.color+"22",border:`2px solid ${u.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:500,color:"#0F172A"}}>{u.name}</p>
                  <p style={{fontSize:11,color:"#94A3B8"}}>{u.role}</p>
                </div>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${sel?group.color:"#CBD5E1"}`,background:sel?group.color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {sel && <i className="ti ti-check" style={{fontSize:11,color:"#fff"}} aria-hidden="true" />}
                </div>
              </div>
            );
          })}
        </div>
        {form.assignees.length > 0 && (
          <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:6}}>
            {form.assignees.map(id => {
              const u = users.find(user => user.uid === id) ?? userById(id);
              if (!u) return null;
              return (
                <div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px 3px 5px",borderRadius:20,background:u.color+"18",border:`1px solid ${u.color}30`}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:u.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:u.color}}>{u.initials}</div>
                  <span style={{fontSize:12,fontWeight:500,color:u.color}}>{u.name.split(" ")[0]}</span>
                  <button onClick={() => toggleA(id)} style={{color:u.color,fontSize:14,lineHeight:1,padding:0,marginLeft:1,opacity:.7}}>×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
