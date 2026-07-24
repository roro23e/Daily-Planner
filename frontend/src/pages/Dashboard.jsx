import { USERS, STATUS_CFG, PRIORITY_CFG } from "../data/constants.js";
import { isOverdue, isToday } from "../data/helpers.js";
import Btn from "../components/ui/Btn.jsx";
import { StatusPill } from "../components/ui/Badges.jsx";

export default function Dashboard({ tasks, currentUser, users = USERS, onNewTask, setPage, groups = [] }) {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.status === "done").length;
  const inProg  = tasks.filter(t => t.status === "in-progress").length;
  const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status)).length;
  const mine    = tasks.filter(t => t.assignees.includes(currentUser?.uid) && t.status !== "done");
  const pct     = total ? Math.round((done / total) * 100) : 0;
  const completedToday = tasks.filter(t => isToday(t.completedAt)).length;
  const dailyRate = total ? Math.round((completedToday / total) * 100) : 0;

  const workload = users.map(u => ({
    ...u,
    active: tasks.filter(t => t.assignees.includes(u.uid) && t.status !== "done").length,
  })).sort((a, b) => b.active - a.active);
  const maxWork = Math.max(...workload.map(u => u.active), 1);

  const STATS = [
    { label:"Total tasks",  value:total,   icon:"ti-clipboard-list", color:"#4F46E5", bg:"#EEF2FF" },
    { label:"In progress",  value:inProg,  icon:"ti-clock",           color:"#0284C7", bg:"#F0F9FF" },
    { label:"Completed",    value:done,    icon:"ti-circle-check",    color:"#059669", bg:"#ECFDF5" },
    { label:"Overdue",      value:overdue, icon:"ti-alert-circle",    color:"#E11D48", bg:"#FFF1F2" },
    { label:"Completed today", value:completedToday, icon:"ti-calendar-check", color:"#7C3AED", bg:"#F5F3FF" },
  ];

  return (
    <div className="anim-fade">
      {/* Welcome banner */}
      <div style={{background:"linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",borderRadius:14,padding:"22px 28px",marginBottom:22,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <p style={{fontSize:13,color:"rgba(255,255,255,.7)",marginBottom:4}}>Welcome back</p>
          <h2 style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:6}}>{currentUser?.name} 👋</h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,.75)"}}>
            {mine.length === 0 ? "You're all caught up — great work!" : `You have ${mine.length} active task${mine.length !== 1 ? "s" : ""} assigned to you.`}
          </p>
        </div>
        <Btn onClick={onNewTask} style={{background:"rgba(255,255,255,.15)",border:"1.5px solid rgba(255,255,255,.3)",color:"#fff"}} icon="ti-plus">New task</Btn>
      </div>

      {/* Stat cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:22}}>
        {STATS.map(s => (
          <div key={s.label} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:12,color:"#64748B",fontWeight:500}}>{s.label}</span>
              <div style={{width:32,height:32,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <i className={`ti ${s.icon}`} style={{fontSize:16,color:s.color}} aria-hidden="true" />
              </div>
            </div>
            <p style={{fontSize:28,fontWeight:700,color:"#0F172A"}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
        {/* Progress */}
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"18px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{fontSize:15,fontWeight:600,color:"#0F172A"}}>Overall progress</h3>
            <span style={{fontSize:13,fontWeight:700,color:"#4F46E5"}}>{pct}%</span>
          </div>
          <p style={{fontSize:12,color:"#94A3B8",marginTop:-10,marginBottom:14}}>{completedToday} task{completedToday !== 1 ? "s" : ""} completed today ({dailyRate}% of total)</p>
          <div style={{height:7,background:"#F1F5F9",borderRadius:4,overflow:"hidden",marginBottom:18}}>
            <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#4F46E5,#7C3AED)",borderRadius:4,transition:"width .6s"}} />
          </div>
          {Object.entries(STATUS_CFG).map(([k, v]) => {
            const cnt = tasks.filter(t => t.status === k).length;
            const p   = total ? Math.round((cnt / total) * 100) : 0;
            return (
              <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:v.color,flexShrink:0}} />
                <span style={{fontSize:13,color:"#64748B",flex:1}}>{v.label}</span>
                <span style={{fontSize:13,fontWeight:600,color:"#0F172A"}}>{cnt}</span>
                <span style={{fontSize:12,color:"#CBD5E1",minWidth:30,textAlign:"right"}}>{p}%</span>
              </div>
            );
          })}
        </div>

        {/* Team workload */}
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"18px 20px"}}>
          <h3 style={{fontSize:15,fontWeight:600,color:"#0F172A",marginBottom:16}}>Team workload</h3>
          {workload.map(u => (
            <div key={u.uid} style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:u.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
                <span style={{fontSize:13,color:"#334155",fontWeight:500,flex:1}}>{u.name}</span>
                <span style={{fontSize:12,color:"#94A3B8"}}>{u.active} active</span>
              </div>
              <div style={{height:5,background:"#F1F5F9",borderRadius:3}}>
                <div style={{width:`${Math.round((u.active / maxWork) * 100)}%`,height:"100%",background:u.color,borderRadius:3,transition:"width .5s"}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My tasks + Priority breakdown */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {/* My tasks */}
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"18px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:15,fontWeight:600,color:"#0F172A"}}>My tasks</h3>
            <button onClick={() => setPage("my-tasks")} style={{fontSize:12,color:"#4F46E5",fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
          </div>
          {mine.length === 0 ? (
            <p style={{fontSize:13,color:"#94A3B8",textAlign:"center",padding:"20px 0"}}>You have no active tasks 🎉</p>
          ) : mine.slice(0, 4).map(t => (
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #F8FAFC"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:PRIORITY_CFG[t.priority].dot,flexShrink:0}} />
              <span style={{flex:1,fontSize:13,color:"#0F172A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
              <StatusPill status={t.status} />
            </div>
          ))}
        </div>

        {/* Priority breakdown */}
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"18px 20px"}}>
          <h3 style={{fontSize:15,fontWeight:600,color:"#0F172A",marginBottom:14}}>Priority breakdown</h3>
          {Object.entries(PRIORITY_CFG).map(([k, v]) => {
            const cnt = tasks.filter(t => t.priority === k).length;
            const p   = total ? Math.round((cnt / total) * 100) : 0;
            return (
              <div key={k} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,color:"#334155",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:v.dot,display:"inline-block"}} />
                    {v.label}
                  </span>
                  <span style={{fontSize:12,color:"#94A3B8"}}>{cnt} tasks · {p}%</span>
                </div>
                <div style={{height:5,background:"#F1F5F9",borderRadius:3}}>
                  <div style={{width:`${p}%`,height:"100%",background:v.dot,borderRadius:3,transition:"width .5s"}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
