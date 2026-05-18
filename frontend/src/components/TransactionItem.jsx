import { fmt, fmtDateShort, getCat } from "../utils/helpers";

export default function TransactionItem({ t, onEdit, onDelete, idx=0 }) {
  const cat = getCat(t.category);
  const isIncome = t.transaction_type==="income";

  return (
    <div className={`au`} style={{...s.row, animationDelay:`${idx*0.035}s`}}>
      {/* Icon */}
      <div style={{...s.icon, background:`${cat.color}15`, border:`1px solid ${cat.color}25`}}>
        {cat.icon}
      </div>

      {/* Info */}
      <div style={s.info}>
        <div style={s.title}>{t.title}</div>
        <div style={s.meta}>
          <span style={{...s.catTag, background:`${cat.color}12`, color:cat.color, border:`1px solid ${cat.color}25`}}>
            {cat.icon} {t.category}
          </span>
          <span style={s.dot}>·</span>
          <span style={s.date}>{fmtDateShort(t.date)}</span>
          {t.recurring && t.recurring!=="none" && (
            <><span style={s.dot}>·</span><span style={s.rec}>↻ {t.recurring}</span></>
          )}
          {t.tags && (
            <><span style={s.dot}>·</span>
            {t.tags.split(",").slice(0,2).map(tag=>(
              <span key={tag} style={s.tag}>{tag.trim()}</span>
            ))}</>
          )}
        </div>
      </div>

      {/* Amount */}
      <div style={s.right}>
        <div style={{...s.amt, color: isIncome?"var(--teal)":"var(--red)"}}>
          {isIncome?"+":"−"}{fmt(t.amount)}
        </div>
        {t.note && <div style={s.note} title={t.note}>{t.note}</div>}
      </div>

      {/* Actions */}
      <div style={s.actions}>
        <button style={s.editBtn} onClick={()=>onEdit(t)}>✎</button>
        <button style={s.delBtn}  onClick={()=>onDelete(t.id)}>✕</button>
      </div>
    </div>
  );
}

const s = {
  row: {
    display:"flex", alignItems:"center", gap:12,
    padding:"12px 14px",
    background:"var(--bg2)", border:"1px solid var(--border)",
    borderRadius:"var(--r)", transition:"all 0.15s",
    cursor:"default",
  },
  icon: { width:42,height:42,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 },
  info: { flex:1,minWidth:0 },
  title: { fontSize:13,fontWeight:500,color:"var(--text)",marginBottom:5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" },
  meta: { display:"flex",alignItems:"center",gap:5,flexWrap:"wrap" },
  catTag: { borderRadius:99,padding:"2px 7px",fontSize:10,fontFamily:"var(--font-m)",fontWeight:500 },
  dot: { color:"var(--text4)",fontSize:11 },
  date: { fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)" },
  rec: { fontFamily:"var(--font-m)",fontSize:9,color:"var(--teal2)",background:"rgba(45,212,191,0.08)",padding:"1px 6px",borderRadius:99 },
  tag: { fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",background:"var(--bg4)",padding:"1px 6px",borderRadius:99 },
  right: { display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0 },
  amt: { fontFamily:"var(--font-d)",fontSize:14,fontWeight:700,letterSpacing:"-0.3px",whiteSpace:"nowrap" },
  note: { fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" },
  actions: { display:"flex",gap:5,flexShrink:0 },
  editBtn: { width:28,height:28,background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"var(--r2)",color:"var(--teal2)",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.14s" },
  delBtn: { width:28,height:28,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"rgba(248,113,113,0.4)",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.14s" },
};