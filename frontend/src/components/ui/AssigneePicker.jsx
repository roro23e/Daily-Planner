import { useState } from "react";
import { USERS } from "../../data/constants.js";
import { userById } from "../../data/helpers.js";

export default function AssigneePicker({ value, onChange, currentUser, users = USERS, restrictTo = null }) {
  const [q, setQ] = useState("");

  const pool = restrictTo
    ? users.filter(u => restrictTo.includes(u.uid))
    : users.filter(u => u.isActive !== false);

  const filtered = pool.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = id => onChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id]);

  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <label style={{fontSize:13,fontWeight:500,color:"#334155"}}>
          {restrictTo ? "Assign to group members" : "Assign to"}
        </label>
        <span style={{fontSize:12,color:"#94A3B8"}}>
          {value.length} selected{restrictTo ? ` of ${restrictTo.length}` : " · max 20"}
        </span>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:8}}>
        <i className="ti ti-search" aria-hidden="true" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:14}} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search team members…" style={{paddingLeft:32}} />
      </div>

      {/* List */}
      <div style={{border:"1.5px solid #E2E8F0",borderRadius:10,overflow:"hidden",maxHeight:220,overflowY:"auto"}}>
        {filtered.length === 0
          ? <div style={{padding:16,textAlign:"center",color:"#94A3B8",fontSize:13}}>No members found</div>
          : filtered.map((u, i) => {
              const sel = value.includes(u.uid);
              return (
                <div
                  key={u.uid}
                  onClick={() => toggle(u.uid)}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",cursor:"pointer",background:sel?"#EEF2FF":"#fff",borderTop:i>0?"1px solid #F1F5F9":"none",transition:"background .12s"}}
                >
                  <div style={{width:36,height:36,borderRadius:"50%",background:u.color+"22",border:`2px solid ${u.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:500,color:"#0F172A",display:"flex",alignItems:"center",gap:6}}>
                      {u.name}
                      {u.uid === currentUser?.uid && <span style={{fontSize:10,background:"#EEF2FF",color:"#4F46E5",padding:"1px 5px",borderRadius:3,fontWeight:600}}>You</span>}
                    </div>
                    <div style={{fontSize:12,color:"#94A3B8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                  </div>
                  <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${sel?"#4F46E5":"#CBD5E1"}`,background:sel?"#4F46E5":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .12s"}}>
                    {sel && <i className="ti ti-check" style={{fontSize:11,color:"#fff"}} aria-hidden="true" />}
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Selected chips */}
      {value.length > 0 && (
        <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
          {value.map(id => {
            const u = users.find(user => user.uid === id) ?? userById(id);
            if (!u) return null;
            return (
              <div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px 3px 5px",borderRadius:20,background:u.color+"18",border:`1px solid ${u.color}30`}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:u.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:u.color}}>{u.initials}</div>
                <span style={{fontSize:12,fontWeight:500,color:u.color}}>{u.name.split(" ")[0]}</span>
                <button onClick={() => toggle(id)} style={{color:u.color,fontSize:14,lineHeight:1,padding:0,marginLeft:1,opacity:.7}}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
