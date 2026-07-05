export function Input({ label, id, error, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      {label && <label htmlFor={id} style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>{label}</label>}
      <input id={id} {...props} style={{...props.style, borderColor: error ? "#F43F5E" : undefined}} />
      {error && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{error}</p>}
    </div>
  );
}

export function Textarea({ label, id, error, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      {label && <label htmlFor={id} style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>{label}</label>}
      <textarea id={id} {...props} />
      {error && <p style={{fontSize:12,color:"#E11D48",marginTop:4}}>{error}</p>}
    </div>
  );
}

export function Select({ label, id, children, ...props }) {
  return (
    <div style={{marginBottom:14,position:"relative"}}>
      {label && <label htmlFor={id} style={{display:"block",fontSize:13,fontWeight:500,color:"#334155",marginBottom:5}}>{label}</label>}
      <div style={{position:"relative"}}>
        <select id={id} {...props} style={{paddingRight:32,...props.style}}>{children}</select>
        <i className="ti ti-chevron-down" aria-hidden="true" style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#94A3B8",pointerEvents:"none"}} />
      </div>
    </div>
  );
}
