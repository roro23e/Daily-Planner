const SIZES    = { sm:{fontSize:12,padding:"5px 11px"}, md:{fontSize:14,padding:"8px 16px"}, lg:{fontSize:15,padding:"10px 20px"} };
const VARIANTS = {
  primary:   { background:"#4F46E5", color:"#fff" },
  secondary: { background:"#F1F5F9", color:"#334155", border:"1.5px solid #E2E8F0" },
  danger:    { background:"#FFF1F2", color:"#BE123C", border:"1.5px solid #FECDD3" },
  ghost:     { background:"transparent", color:"#64748B" },
  success:   { background:"#ECFDF5", color:"#047857", border:"1.5px solid #A7F3D0" },
};
const HOVER = {
  primary:"#4338CA", secondary:"#E2E8F0", ghost:"#F1F5F9", danger:"#FFE4E6", success:"#D1FAE5",
};

export default function Btn({ children, variant="primary", size="md", onClick, disabled, full, style:sx, icon, type="button" }) {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
    fontWeight:500, borderRadius:8, border:"none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition:"all .15s", flexShrink:0,
    opacity: disabled ? .55 : 1,
    whiteSpace:"nowrap",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...SIZES[size], ...VARIANTS[variant], width:full?"100%":undefined, ...sx }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = HOVER[variant] ?? VARIANTS[variant].background; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = VARIANTS[variant].background; }}
    >
      {icon && <i className={`ti ${icon}`} style={{fontSize:16}} aria-hidden="true" />}
      {children}
    </button>
  );
}
