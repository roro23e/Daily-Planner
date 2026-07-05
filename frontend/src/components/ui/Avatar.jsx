import { userById } from "../../data/helpers.js";

export function Avatar({ uid: id, size = 28, ring = false }) {
  const u = userById(id);
  if (!u) return null;
  return (
    <div
      title={u.name}
      style={{
        width:size, height:size, borderRadius:"50%", flexShrink:0,
        background: u.color + "22",
        border: ring ? "2px solid #fff" : `1.5px solid ${u.color}44`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: size * 0.35, fontWeight:600, color: u.color,
        userSelect:"none", letterSpacing:"0.01em",
      }}
    >
      {u.initials}
    </div>
  );
}

export function AvatarStack({ uids, max = 3 }) {
  const shown = uids.slice(0, max);
  const extra = uids.length - max;
  if (!uids.length) return <span style={{fontSize:12,color:"#94A3B8",fontStyle:"italic"}}>Unassigned</span>;
  return (
    <div style={{display:"flex",alignItems:"center"}}>
      {shown.map((id, i) => (
        <div key={id} style={{marginLeft: i === 0 ? 0 : -8, zIndex: shown.length - i}}>
          <Avatar uid={id} size={24} ring />
        </div>
      ))}
      {extra > 0 && (
        <div style={{marginLeft:-8,width:24,height:24,borderRadius:"50%",background:"#E2E8F0",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:"#64748B"}}>
          +{extra}
        </div>
      )}
    </div>
  );
}
