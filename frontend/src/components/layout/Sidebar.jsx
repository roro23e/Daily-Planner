import { USERS } from "../../data/constants.js";
import { Badge } from "../ui/Badges.jsx";

export default function Sidebar({ page, setPage, currentUser, tasks, groups = [], users = USERS, collapsed }) {
  const myActive = tasks.filter(t => t.assignees.includes(currentUser?.uid) && t.status !== "done").length;

  const navItems = [
    { id:"dashboard", icon:"ti-layout-dashboard", label:"Dashboard" },
    { id:"tasks",     icon:"ti-columns",           label:"All tasks" },
    { id:"my-tasks",  icon:"ti-user-check",        label:"My tasks",  badge: myActive },
    { id:"team",      icon:"ti-users",             label:"Team",      badge: groups.length },
    { id:"profile",   icon:"ti-user-circle",       label:"Profile" },
  ];

  return (
    <aside style={{width:collapsed?0:220,minWidth:collapsed?0:220,background:"#fff",borderRight:"1px solid #E2E8F0",display:"flex",flexDirection:"column",overflow:"hidden",transition:"width .2s,min-width .2s",flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:"16px 14px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:30,height:30,borderRadius:8,background:"#4F46E5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <i className="ti ti-checklist" style={{color:"#fff",fontSize:16}} aria-hidden="true" />
        </div>
        <span style={{fontSize:16,fontWeight:700,color:"#0F172A",whiteSpace:"nowrap",letterSpacing:"-.01em"}}>TaskFlow</span>
      </div>

      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        <p style={{fontSize:10,fontWeight:700,color:"#CBD5E1",textTransform:"uppercase",letterSpacing:".08em",padding:"8px 10px 4px"}}>Navigation</p>
        {navItems.map(item => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:7,border:"none",background:active?"#EEF2FF":"transparent",color:active?"#4F46E5":"#475569",cursor:"pointer",fontSize:13,fontWeight:active?600:400,marginBottom:2,textAlign:"left",whiteSpace:"nowrap"}}
            >
              <i className={`ti ${item.icon}`} style={{fontSize:17,flexShrink:0}} aria-hidden="true" />
              <span style={{flex:1}}>{item.label}</span>
              {item.badge > 0 && <Badge color={active?"#4F46E5":"#94A3B8"} bg={active?"#EEF2FF":"#F1F5F9"}>{item.badge}</Badge>}
            </button>
          );
        })}

        {/* Groups section */}
        {groups.length > 0 && (
          <>
            <p style={{fontSize:10,fontWeight:700,color:"#CBD5E1",textTransform:"uppercase",letterSpacing:".08em",padding:"16px 10px 4px"}}>Groups</p>
            {groups.map(g => (
              <div key={g.id} onClick={() => setPage("team")} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 10px",borderRadius:7,cursor:"pointer"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:g.color,flexShrink:0}} />
                <span style={{fontSize:12,color:"#64748B",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</span>
                <span style={{fontSize:10,color:"#CBD5E1"}}>{g.memberIds.length}</span>
              </div>
            ))}
          </>
        )}

        {/* Members section */}
        <p style={{fontSize:10,fontWeight:700,color:"#CBD5E1",textTransform:"uppercase",letterSpacing:".08em",padding:"16px 10px 4px"}}>Members</p>
        {users.map(u => (
          <div key={u.uid} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:7}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:u.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
            <span style={{fontSize:12,color:"#64748B",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</span>
            {u.uid === currentUser?.uid && <span style={{fontSize:9,color:"#4F46E5",fontWeight:700}}>you</span>}
          </div>
        ))}
      </nav>

      {/* Current user footer */}
      <div style={{padding:"10px 8px",borderTop:"1px solid #F1F5F9"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:8}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:(currentUser?.color ?? "#4F46E5")+"20",border:`1.5px solid ${currentUser?.color ?? "#4F46E5"}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:currentUser?.color,flexShrink:0}}>{currentUser?.initials}</div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:12,fontWeight:600,color:"#0F172A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.name}</p>
            <p style={{fontSize:10,color:"#94A3B8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
