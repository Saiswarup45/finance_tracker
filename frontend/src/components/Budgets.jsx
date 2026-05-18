import { useState } from "react";
import { CATEGORIES, fmt, thisMonth, thisYear, MONTHS } from "../utils/helpers";

const EXPENSE_CATS = CATEGORIES.filter(c=>!["Salary","Freelance","Investment"].includes(c.name));

export default function Budgets({ budgets, transactions, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category:"Food", limit:"", month:thisMonth(), year:thisYear() });
  const [busy, setBusy] = useState(false);

  const getSpent = (cat, month, year) =>
    transactions.filter(t=>{
      const d=new Date(t.date);
      return t.transaction_type==="expense" && t.category===cat &&
             d.getMonth()+1===month && d.getFullYear()===year;
    }).reduce((s,t)=>s+parseFloat(t.amount),0);

  const submit = async () => {
    if(!form.limit) return;
    setBusy(true);
    try { await onAdd(form); setShowForm(false); setForm({category:"Food",limit:"",month:thisMonth(),year:thisYear()}); }
    finally { setBusy(false); }
  };

  return (
    <div style={s.wrap}>
      <div style={s.hdr}>
        <div>
          <div style={s.title}>Budgets</div>
          <div style={s.sub}>Monthly spending limits by category</div>
        </div>
        <button style={s.addBtn} onClick={()=>setShowForm(v=>!v)}>
          {showForm?"✕ Cancel":"+ New Budget"}
        </button>
      </div>

      {showForm && (
        <div style={s.form} className="au">
          <div style={s.formTitle}>Create Budget</div>
          <div style={s.formRow}>
            <Field label="Category">
              <select style={s.inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                {EXPENSE_CATS.map(c=><option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
            </Field>
            <Field label="Limit (₹)">
              <input style={s.inp} type="number" placeholder="5000"
                value={form.limit} onChange={e=>setForm({...form,limit:e.target.value})} />
            </Field>
            <Field label="Month">
              <select style={s.inp} value={form.month} onChange={e=>setForm({...form,month:parseInt(e.target.value)})}>
                {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
            </Field>
            <Field label="Year">
              <input style={s.inp} type="number" value={form.year}
                onChange={e=>setForm({...form,year:parseInt(e.target.value)})} />
            </Field>
          </div>
          <button style={s.submitBtn} onClick={submit} disabled={busy}>
            {busy?"Saving…":"Create Budget"}
          </button>
        </div>
      )}

      {budgets.length===0 && !showForm ? (
        <div style={s.empty}>
          <div style={s.emptyIco}>◎</div>
          <div style={s.emptyTxt}>No budgets yet</div>
          <div style={s.emptySub}>Set spending limits to stay on track</div>
        </div>
      ) : (
        <div style={s.grid}>
          {budgets.map((b,i)=>{
            const spent = getSpent(b.category, b.month, b.year);
            const lim   = parseFloat(b.limit);
            const pct   = Math.min((spent/lim)*100,100);
            const cat   = CATEGORIES.find(c=>c.name===b.category);
            const over  = spent>lim;
            const warn  = pct>=80 && !over;
            const barColor = over?"var(--red)":warn?"var(--amber)":"var(--teal)";
            const mn    = MONTHS[b.month-1];

            return (
              <div key={b.id} className="au" style={{...s.card, animationDelay:`${i*0.05}s`}}>
                <div style={s.cardTop}>
                  <div style={{...s.catIco, background:`${cat?.color||"#2dd4bf"}18`}}>
                    {cat?.icon||"📦"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={s.catName}>{b.category}</div>
                    <div style={s.period}>{mn} {b.year}</div>
                  </div>
                  <button style={s.delBtn} onClick={()=>onDelete(b.id)}>✕</button>
                </div>

                {/* Progress bar */}
                <div style={s.prog}>
                  <div style={{...s.progFill, width:`${pct}%`, background:barColor}} />
                </div>

                <div style={s.cardBot}>
                  <div style={s.spentRow}>
                    <span style={{color:barColor,fontWeight:600,fontFamily:"var(--font-d)"}}>{fmt(spent)}</span>
                    <span style={{color:"var(--text3)",fontFamily:"var(--font-m)",fontSize:11}}> / {fmt(lim)}</span>
                  </div>
                  <span style={{...s.statusTag, color:barColor, background:`${barColor==="var(--red)"?"rgba(248,113,113":barColor==="var(--amber)"?"rgba(251,191,36":"rgba(45,212,191"},0.1)`}}>
                    {over?"Over!":warn?`${pct.toFixed(0)}% used`:`${pct.toFixed(0)}%`}
                  </span>
                </div>

                <div style={s.remaining}>
                  {over
                    ? <span style={{color:"var(--red)"}}>Overspent by {fmt(spent-lim)}</span>
                    : <span style={{color:"var(--text3)"}}>Remaining: {fmt(lim-spent)}</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
      <label style={{fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",letterSpacing:"0.12em",textTransform:"uppercase"}}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  wrap:{padding:"16px 20px"},
  hdr:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16},
  title:{fontFamily:"var(--font-d)",fontSize:20,fontWeight:700,letterSpacing:"-0.3px"},
  sub:{fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)",marginTop:3},
  addBtn:{background:"linear-gradient(135deg,var(--teal3),var(--teal))",border:"none",borderRadius:"var(--r2)",color:"#fff",fontSize:12,fontWeight:600,padding:"8px 16px",boxShadow:"0 0 12px rgba(45,212,191,0.3)"},
  form:{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"18px 20px",marginBottom:16,display:"flex",flexDirection:"column",gap:14},
  formTitle:{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700},
  formRow:{display:"flex",gap:12,flexWrap:"wrap"},
  inp:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text)",fontFamily:"var(--font-b)",fontSize:13,padding:"9px 12px",width:"100%"},
  submitBtn:{background:"linear-gradient(135deg,var(--teal3),var(--teal))",border:"none",borderRadius:"var(--r2)",color:"#fff",fontSize:13,fontWeight:600,padding:"9px 22px",alignSelf:"flex-start",boxShadow:"0 0 12px rgba(45,212,191,0.25)"},
  empty:{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 0",gap:10},
  emptyIco:{fontSize:36,color:"var(--text4)"},
  emptyTxt:{fontSize:14,fontWeight:600,color:"var(--text2)"},
  emptySub:{fontFamily:"var(--font-m)",fontSize:11,color:"var(--text3)"},
  grid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12},
  card:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"16px 18px",display:"flex",flexDirection:"column",gap:10},
  cardTop:{display:"flex",alignItems:"center",gap:10},
  catIco:{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19},
  catName:{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700},
  period:{fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",marginTop:2},
  delBtn:{background:"transparent",border:"1px solid var(--border)",borderRadius:7,color:"rgba(248,113,113,0.35)",fontSize:10,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center"},
  prog:{height:5,background:"var(--bg3)",borderRadius:99,overflow:"hidden"},
  progFill:{height:"100%",borderRadius:99,transition:"width 0.6s ease"},
  cardBot:{display:"flex",alignItems:"center",justifyContent:"space-between"},
  spentRow:{fontFamily:"var(--font-b)",fontSize:13},
  statusTag:{fontFamily:"var(--font-m)",fontSize:9,padding:"3px 8px",borderRadius:99,letterSpacing:"0.05em"},
  remaining:{fontFamily:"var(--font-m)",fontSize:10},
};