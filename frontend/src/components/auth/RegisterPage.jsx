import { useState } from "react";
import { api } from "../../services/api.js";
import { Input } from "../ui/FormFields.jsx";
import { Spinner } from "../ui/Badges.jsx";
import Btn from "../ui/Btn.jsx";

export default function RegisterPage({ onRegister, onBack }) {
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = async () => {
    setErrors({});
    setServerError("");
    const e = {};
    if (!form.name.trim())           e.name     = "Name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6)    e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const newUser = {
      name:     form.name,
      email:    form.email,
      password: form.password,
      initials: form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      color:    "#4F46E5",
      role:     "member",
    };
    try {
      const saved = await api.register(newUser);
      onRegister(saved);
    } catch (err) {
      setServerError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"flex",width:"100vw",height:"100vh",alignItems:"center",justifyContent:"center",background:"#F8FAFC"}}>
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #E2E8F0",padding:36,width:"100%",maxWidth:420,boxShadow:"0 8px 32px rgba(15,23,42,.08)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#64748B",fontSize:13,display:"flex",alignItems:"center",gap:5,marginBottom:24,padding:0}}>
          <i className="ti ti-arrow-left" style={{fontSize:15}} aria-hidden="true" /> Back to sign in
        </button>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:28}}>
          <div style={{width:30,height:30,borderRadius:8,background:"#4F46E5",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="ti ti-checklist" style={{color:"#fff",fontSize:16}} aria-hidden="true" />
          </div>
          <span style={{fontSize:16,fontWeight:700,color:"#0F172A"}}>TaskFlow</span>
        </div>
        <h1 style={{fontSize:22,fontWeight:700,color:"#0F172A",marginBottom:6}}>Create your account</h1>
        <p style={{fontSize:14,color:"#64748B",marginBottom:24}}>Join your team on TaskFlow.</p>

        {serverError && (
          <div style={{padding:"10px 14px",background:"#FFF1F2",border:"1px solid #FECDD3",borderRadius:8,color:"#E11D48",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <i className="ti ti-circle-x" style={{fontSize:15,flexShrink:0}} aria-hidden="true" /> {serverError}
          </div>
        )}

        <Input label="Full name"       id="name"  value={form.name}     onChange={set("name")}     placeholder="Alex Morgan"           error={errors.name}     />
        <Input label="Email address"   id="email" type="email" value={form.email} onChange={set("email")} placeholder="alex@taskflow.io"  error={errors.email}    />
        <div style={{marginBottom:14}}>
          <label htmlFor="pw" style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Password</label>
          <div style={{position:"relative"}}>
            <input id="pw" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 6 characters" style={{paddingRight:40,borderColor:errors.password ? "#F43F5E" : undefined}} />
            <button type="button" onClick={() => setShowPw(p => !p)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94A3B8",fontSize:16,padding:2}}>
              <i className={`ti ${showPw ? "ti-eye" : "ti-eye-off"}`} aria-hidden="true" />
            </button>
          </div>
          {errors.password && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{errors.password}</p>}
        </div>
        <div style={{marginBottom:14}}>
          <label htmlFor="cpw" style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>Confirm password</label>
          <div style={{position:"relative"}}>
            <input id="cpw" type={showConfirm ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="Repeat your password" style={{paddingRight:40,borderColor:errors.confirm ? "#F43F5E" : undefined}} />
            <button type="button" onClick={() => setShowConfirm(p => !p)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94A3B8",fontSize:16,padding:2}}>
              <i className={`ti ${showConfirm ? "ti-eye" : "ti-eye-off"}`} aria-hidden="true" />
            </button>
          </div>
          {errors.confirm && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{errors.confirm}</p>}
        </div>
        <Btn full onClick={submit} disabled={loading} size="lg" style={{justifyContent:"center",background:"#4F46E5",color:"#fff",marginTop:8}}>
          {loading ? <><Spinner size={15} /> Creating account…</> : "Create account"}
        </Btn>
      </div>
    </div>
  );
}
