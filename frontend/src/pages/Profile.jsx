import Btn from "../components/ui/Btn.jsx";

export default function ProfileView({ currentUser, tasks, onLogout }) {
  const mine = tasks.filter(t => t.assignees.includes(currentUser?.uid));
  const done = mine.filter(t => t.status === "done");
  const pct  = mine.length ? Math.round((done.length / mine.length) * 100) : 0;

  const FERN = [
    ["F", "Firebase",   "Auth · Firestore · Storage",        "#F59E0B"],
    ["E", "Express.js", "REST API · middleware · RBAC",       "#22C55E"],
    ["R", "React",      "Frontend UI · hooks · state",        "#38BDF8"],
    ["N", "Node.js",    "Server runtime · Cloud Functions",   "#4ADE80"],
  ];

  return (
    <div className="anim-fade" style={{maxWidth:560}}>
      {/* Profile card */}
      <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:24,marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:(currentUser?.color ?? "#4F46E5")+"20",border:`2px solid ${currentUser?.color ?? "#4F46E5"}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:currentUser?.color}}>
            {currentUser?.initials}
          </div>
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"#0F172A"}}>{currentUser?.name}</h2>
            <p style={{fontSize:13,color:"#64748B"}}>{currentUser?.email}</p>
            <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:10,background:"#EEF2FF",color:"#4F46E5",marginTop:4,display:"inline-block"}}>{currentUser?.role}</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[["My tasks", mine.length,"#4F46E5","#EEF2FF"],["Completed",done.length,"#059669","#ECFDF5"],["Rate",`${pct}%`,"#D97706","#FFFBEB"]].map(([l,v,c,bg]) => (
            <div key={l} style={{background:bg,borderRadius:8,padding:12,textAlign:"center"}}>
              <p style={{fontSize:22,fontWeight:700,color:c}}>{v}</p>
              <p style={{fontSize:12,color:c+"bb"}}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FERN stack card */}
      <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:20,marginBottom:16}}>
        <h3 style={{fontSize:14,fontWeight:600,color:"#0F172A",marginBottom:14}}>FERN stack</h3>
        {FERN.map(([letter, name, desc, color]) => (
          <div key={letter} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #F8FAFC"}}>
            <div style={{width:34,height:34,borderRadius:8,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color,flexShrink:0}}>{letter}</div>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:"#0F172A"}}>{name}</p>
              <p style={{fontSize:12,color:"#94A3B8"}}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Btn variant="secondary" icon="ti-logout" onClick={onLogout} full>Sign out</Btn>
    </div>
  );
}
