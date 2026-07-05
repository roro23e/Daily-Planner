import { useState } from "react";
import { USERS } from "../../data/constants.js";
import { api } from "../../services/api.js";
import { Input } from "../ui/FormFields.jsx";
import { Spinner } from "../ui/Badges.jsx";
import Btn from "../ui/Btn.jsx";

export default function LoginPage({ users = USERS, onLogin, onGoRegister }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const showDemoAccounts = import.meta.env.VITE_SHOW_DEMO_ACCOUNTS === "true";

  const submit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const user = await api.login({ email, password });
      onLogin(user);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"flex",width:"100vw",height:"100vh",overflow:"hidden"}}>
      {/* Left: form */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,background:"#fff",overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:380}}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:36}}>
            <div style={{width:34,height:34,borderRadius:9,background:"#4F46E5",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="ti ti-checklist" style={{color:"#fff",fontSize:18}} aria-hidden="true" />
            </div>
            <span style={{fontSize:18,fontWeight:700,color:"#0F172A",letterSpacing:"-.01em"}}>TaskFlow</span>
          </div>

          <h1 style={{fontSize:26,fontWeight:700,color:"#0F172A",marginBottom:6,letterSpacing:"-.02em"}}>Welcome back</h1>
          <p style={{fontSize:15,color:"#64748B",marginBottom:28}}>Sign in to your workspace to continue.</p>

          {error && (
            <div style={{padding:"10px 14px",background:"#FFF1F2",border:"1px solid #FECDD3",borderRadius:8,color:"#E11D48",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
              <i className="ti ti-circle-x" style={{fontSize:15,flexShrink:0}} aria-hidden="true" /> {error}
            </div>
          )}

          <Input label="Email address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@taskflow.io" />
          <Input label="Password" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />

          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:22,marginTop:-6}}>
            <button style={{background:"none",border:"none",color:"#4F46E5",fontSize:13,cursor:"pointer",fontWeight:500}}>Forgot password?</button>
          </div>

          <Btn full onClick={submit} disabled={loading} size="lg" style={{background:"#4F46E5",color:"#fff",justifyContent:"center"}}>
            {loading ? <><Spinner size={15} /> Signing in…</> : "Sign in"}
          </Btn>

          <p style={{textAlign:"center",fontSize:14,color:"#64748B",marginTop:22}}>
            Don't have an account?{" "}
            <button onClick={onGoRegister} style={{background:"none",border:"none",color:"#4F46E5",cursor:"pointer",fontSize:14,fontWeight:600}}>Create one</button>
          </p>

          {showDemoAccounts && (
          <div style={{marginTop:28,padding:"14px 16px",background:"#F8FAFC",borderRadius:10,border:"1px solid #E2E8F0"}}>
            <p style={{fontSize:11,color:"#94A3B8",fontWeight:600,textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Demo accounts</p>
            {users.map(u => (
              <button
                key={u.uid}
                onClick={() => { setEmail(u.email); setPassword("password"); }}
                style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"5px 0",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}
              >
                <div style={{width:24,height:24,borderRadius:"50%",background:u.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:u.color,flexShrink:0}}>{u.initials}</div>
                <div style={{flex:1}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#334155"}}>{u.name}</span>
                  <span style={{fontSize:11,color:"#94A3B8",marginLeft:6}}>· {u.role}</span>
                </div>
                <span style={{fontSize:11,color:"#CBD5E1"}}>{u.email}</span>
              </button>
            ))}
          </div>
          )}
        </div>
      </div>

      {/* Right: brand panel */}
      <div style={{width:440,background:"linear-gradient(160deg,#1E1B4B 0%,#3730A3 50%,#4F46E5 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:56,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:260,height:260,borderRadius:"50%",background:"rgba(255,255,255,.04)"}} />
        <div style={{position:"absolute",bottom:-40,left:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.05)"}} />
        <div style={{position:"relative",zIndex:1,textAlign:"center",color:"#fff"}}>
          <div style={{fontSize:56,marginBottom:20}}>✓</div>
          <h2 style={{fontSize:22,fontWeight:700,marginBottom:12}}>Task management, simplified</h2>
          <p style={{color:"rgba(255,255,255,.7)",lineHeight:1.7,fontSize:15,marginBottom:36}}>Assign tasks, track progress, and ship faster — built on the FERN stack.</p>
          {["Assign tasks to any team member","Kanban board with real-time updates","Firebase · Express · React · Node"].map((f, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,.85)",fontSize:13,marginBottom:10,textAlign:"left"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <i className="ti ti-check" style={{fontSize:11,color:"#fff"}} aria-hidden="true" />
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
