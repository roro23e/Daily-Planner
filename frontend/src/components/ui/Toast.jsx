export default function Toast({ toasts, dismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{position:"fixed",bottom:24,right:24,display:"flex",flexDirection:"column",gap:8,zIndex:2000}}>
      {toasts.map(t => (
        <div
          key={t.id}
          className="anim-fade"
          style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#0F172A",color:"#fff",borderRadius:10,fontSize:13,fontWeight:500,boxShadow:"0 8px 24px rgba(15,23,42,.25)",minWidth:240,maxWidth:360}}
        >
          <i
            className={`ti ${t.type === "error" ? "ti-circle-x" : t.type === "success" ? "ti-circle-check" : "ti-info-circle"}`}
            style={{fontSize:16, color: t.type === "error" ? "#FB7185" : t.type === "success" ? "#34D399" : "#818CF8", flexShrink:0}}
            aria-hidden="true"
          />
          <span style={{flex:1}}>{t.message}</span>
          <button onClick={() => dismiss(t.id)} style={{color:"#94A3B8",fontSize:16,padding:2}}>
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
