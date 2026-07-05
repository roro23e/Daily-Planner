import { useState } from "react";
import { USERS, GROUP_PALETTE } from "../../data/constants.js";
import { uid, userById } from "../../data/helpers.js";
import Modal from "../ui/Modal.jsx";
import Btn from "../ui/Btn.jsx";

export default function GroupModal({ group, onSave, onClose, currentUser, users = USERS }) {
  const isEdit = !!group;
  const [name,        setName]        = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [color,       setColor]       = useState(group?.color ?? GROUP_PALETTE[0]);
  const [memberIds,   setMemberIds]   = useState(group?.memberIds ?? [currentUser?.uid].filter(Boolean));
  const [memberQ,     setMemberQ]     = useState("");
  const [nameErr,     setNameErr]     = useState("");
  const [saving,      setSaving]      = useState(false);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(memberQ.toLowerCase()) ||
    u.email.toLowerCase().includes(memberQ.toLowerCase())
  );

  const toggleMember = id => {
    if (id === currentUser?.uid) return; // creator locked
    setMemberIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const save = async () => {
    if (!name.trim()) { setNameErr("Group name is required"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 350));
    await onSave({
      id:          group?.id ?? "g" + uid(),
      name:        name.trim(),
      description: description.trim(),
      color,
      memberIds,
      createdBy:  group?.createdBy ?? currentUser?.uid,
      createdAt:  group?.createdAt ?? new Date().toISOString().split("T")[0],
    });
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      title={isEdit ? "Edit group" : "Create new group"}
      sub={isEdit ? "Update group details and members" : "Give your group a name, pick members, then assign tasks to it"}
      onClose={onClose}
      wide
      footer={<>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={save} disabled={saving} icon={saving ? "ti-loader-2" : isEdit ? "ti-device-floppy" : "ti-users-plus"}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create group"}
        </Btn>
      </>}
    >
      {/* Name */}
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Group name *</label>
        <input value={name} onChange={e => { setName(e.target.value); setNameErr(""); }} placeholder="e.g. Backend team" style={{borderColor:nameErr?"#F43F5E":undefined}} />
        {nameErr && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{nameErr}</p>}
      </div>

      {/* Description */}
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does this group work on?" rows={2} />
      </div>

      {/* Colour */}
      <div style={{marginBottom:18}}>
        <label style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:8}}>Group colour</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {GROUP_PALETTE.map(c => (
            <button key={c} onClick={() => setColor(c)} aria-label={c} style={{width:28,height:28,borderRadius:"50%",background:c,border:"none",cursor:"pointer",outline:color===c?`3px solid ${c}`:"3px solid transparent",outlineOffset:2,transition:"outline .15s"}} />
          ))}
        </div>
      </div>

      {/* Member picker */}
      <div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <label style={{fontSize:13,fontWeight:500,color:"#334155"}}>Members</label>
          <span style={{fontSize:12,color:"#94A3B8"}}>{memberIds.length} selected</span>
        </div>
        <div style={{position:"relative",marginBottom:8}}>
          <i className="ti ti-search" aria-hidden="true" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:14}} />
          <input value={memberQ} onChange={e => setMemberQ(e.target.value)} placeholder="Search members…" style={{paddingLeft:32}} />
        </div>
        <div style={{border:"1.5px solid #E2E8F0",borderRadius:10,overflow:"hidden",maxHeight:200,overflowY:"auto"}}>
          {filteredUsers.map((u, i) => {
            const sel    = memberIds.includes(u.uid);
            const locked = u.uid === currentUser?.uid;
            return (
              <div key={u.uid} onClick={() => !locked && toggleMember(u.uid)} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 13px",cursor:locked?"default":"pointer",background:sel?"#EEF2FF":"#fff",borderTop:i>0?"1px solid #F1F5F9":"none",transition:"background .12s"}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:u.color+"22",border:`2px solid ${u.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#0F172A",display:"flex",alignItems:"center",gap:6}}>
                    {u.name}
                    {locked && <span style={{fontSize:10,background:"#EEF2FF",color:"#4F46E5",padding:"1px 5px",borderRadius:3,fontWeight:600}}>creator</span>}
                  </div>
                  <div style={{fontSize:11,color:"#94A3B8"}}>{u.email} · {u.role}</div>
                </div>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${sel?"#4F46E5":"#CBD5E1"}`,background:sel?"#4F46E5":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:locked?.5:1}}>
                  {sel && <i className="ti ti-check" style={{fontSize:11,color:"#fff"}} aria-hidden="true" />}
                </div>
              </div>
            );
          })}
        </div>
        {/* Selected chips */}
        {memberIds.length > 0 && (
          <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
            {memberIds.map(id => {
              const u      = users.find(user => user.uid === id) ?? userById(id);
              if (!u) return null;
              const locked = id === currentUser?.uid;
              return (
                <div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px 3px 5px",borderRadius:20,background:u.color+"18",border:`1px solid ${u.color}30`}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:u.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:u.color}}>{u.initials}</div>
                  <span style={{fontSize:12,fontWeight:500,color:u.color}}>{u.name.split(" ")[0]}</span>
                  {!locked && <button onClick={() => toggleMember(id)} style={{color:u.color,fontSize:14,lineHeight:1,padding:0,marginLeft:1,opacity:.7}}>×</button>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
