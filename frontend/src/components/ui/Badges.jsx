import { PRIORITY_CFG, STATUS_CFG } from "../../data/constants.js";

export function PriorityBadge({ priority }) {
  const c = PRIORITY_CFG[priority];
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:5,background:c.bg,color:c.text,border:`1px solid ${c.border}`}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}} />
      {c.label}
    </span>
  );
}

export function StatusPill({ status }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:10,background:c.bg,color:c.color,border:`1px solid ${c.accent}`}}>
      {c.label}
    </span>
  );
}

export function Tag({ label }) {
  return (
    <span style={{fontSize:11,fontWeight:500,padding:"1px 7px",borderRadius:4,background:"#F1F5F9",color:"#475569",border:"1px solid #E2E8F0"}}>
      {label}
    </span>
  );
}

export function Badge({ children, color = "#4F46E5", bg = "#EEF2FF" }) {
  return (
    <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:10,background:bg,color,minWidth:18,textAlign:"center"}}>
      {children}
    </span>
  );
}

export function Spinner({ size = 16 }) {
  return (
    <div style={{width:size,height:size,border:"2px solid #E2E8F0",borderTopColor:"#4F46E5",borderRadius:"50%",animation:"spin .7s linear infinite"}} />
  );
}

export function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{textAlign:"center",padding:"56px 20px",color:"#94A3B8"}}>
      <i className={`ti ${icon}`} style={{fontSize:40,display:"block",marginBottom:12}} aria-hidden="true" />
      <p style={{fontSize:15,fontWeight:500,color:"#475569",marginBottom:4}}>{title}</p>
      <p style={{fontSize:13,marginBottom:action?20:0}}>{sub}</p>
      {action}
    </div>
  );
}
