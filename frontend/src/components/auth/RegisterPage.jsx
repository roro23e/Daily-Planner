import { useState } from "react";
import { api } from "../../services/api.js";
import { Input } from "../ui/FormFields.jsx";
import { Spinner } from "../ui/Badges.jsx";
import Btn from "../ui/Btn.jsx";

export default function RegisterPage({ onRegister, onBack }) {
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = async () => {
    const e = {};
    if (!form.name.trim())           e.name     = "Name is required";
    if (!form.email.includes("@"))   e.email    = "Enter a valid email";
    if (form.password.length < 8)    e.password = "Password must be at least 8 characters";
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
        <Input label="Full name"       id="name"  value={form.name}     onChange={set("name")}     placeholder="Alex Rivera"           error={errors.name}     />
        <Input label="Email address"   id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@taskflow.io"  error={errors.email}    />
        <Input label="Password"        id="pw"    type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" error={errors.password} />
        <Input label="Confirm password" id="cpw"  type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat your password" error={errors.confirm}  />
        <Btn full onClick={submit} disabled={loading} size="lg" style={{justifyContent:"center",background:"#4F46E5",color:"#fff"}}>
          {loading ? <><Spinner size={15} /> Creating account…</> : "Create account"}
        </Btn>
      </div>
    </div>
  );
}
