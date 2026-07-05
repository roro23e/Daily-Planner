import { useEffect } from "react";

export default function Modal({ title, sub, onClose, children, footer, wide }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,.5)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:1000, padding:16, backdropFilter:"blur(2px)",
      }}
    >
      <div
        className="anim-scale"
        style={{
          background:"#fff", borderRadius:14, width:"100%",
          maxWidth: wide ? 640 : 480,
          maxHeight:"90vh", overflow:"hidden",
          display:"flex", flexDirection:"column",
          boxShadow:"0 24px 64px rgba(15,23,42,.18)",
        }}
      >
        {/* Header */}
        <div style={{padding:"18px 22px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <h2 style={{fontSize:17,fontWeight:600,color:"#0F172A"}}>{title}</h2>
            {sub && <p style={{fontSize:13,color:"#64748B",marginTop:2}}>{sub}</p>}
          </div>
          <button
            onClick={onClose}
            style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color:"#64748B",cursor:"pointer",flexShrink:0,marginLeft:12}}
          >
            <i className="ti ti-x" style={{fontSize:16}} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div style={{overflowY:"auto",flex:1,padding:"20px 22px"}}>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{padding:"14px 22px",borderTop:"1px solid #F1F5F9",display:"flex",justifyContent:"flex-end",gap:10,flexShrink:0}}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
