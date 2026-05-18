import { useState } from "react";
import { fmt } from "../utils/helpers";

const GOAL_ICONS = ["🏠","🚗","✈️","💍","🎓","💻","📱","🏋️","🌴","💰","🎯","⭐"];

export default function Goals({ goals, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem]  = useState(null);
  const [form, setForm] = useState({ name:"", target:"", saved:"0", icon:"🎯", deadline:"", color:"#2dd4bf" });
  const [busy, setBusy] = useState(false);
  const [addSavedId, setAddSavedId] = useState(null);
  const [addAmt, setAddAmt] = useState("");

  const openEdit = (g) => {
    setEditItem(g);
    setForm({ name:g.name, target:g.target, saved:g.saved, icon:g.icon||"🎯", deadline:g.deadline||"", color:g.color||"#2dd4bf" });
    setShowForm(true);
  };

  const submit = async () => {
    if(!form.name || !form.target) return;
    setBusy(true);
    try {
      if(editItem) await onUpdate(editItem.id, form);
      else         await onAdd(form);
      setShowForm(false); setEditItem(null);
      setForm({ name:"", target:"", saved:"0", icon:"🎯", deadline:"", color:"#2dd4bf" });
    } finally { setBusy(false); }
  };

  const addSaved = async (g) => {
    const extra = parseFloat(addAmt);
    if(!extra || extra<=0) return;
    await onUpdate(g.id, { ...g, saved: parseFloat(g.saved)+extra });
    setAddSavedId(null); setAddAmt("");
  };

  const totalTarget = goals.reduce((s,g)=>s+parseFloat(g.target),0);
  const totalSaved  = goals.reduce((s,g)=>s+parseFloat(g.saved),0);
  const overallPct  = totalTarget>0 ? (totalSaved/totalTarget)*100 : 0;

  return (
    <div style={s.wrap}>
      <div style={s.hdr}>
        <div>
          <div style={s.title}>Savings Goals</div>
          <div style={s.sub}>Track progress toward your financial targets</div>
        </div>
        <button style={s.addBtn} onClick={()=>{ setShowForm(v=>!v); setEditItem(null); setForm({name:"",target:"",saved:"0",icon:"🎯",deadline:"",color:"#2dd4bf"}); }}>
          {showForm&&!editItem?"✕ Cancel":"+ New Goal"}
        </button>
      </div>

      {/* Overall progress */}
      {goals.length>0 && (
        <div style={s.overallCard} className="au">
          <div style={s.overallTop}>
            <span style={s.overallLbl}>Overall Progress</span>
            <span style={s.overallPct}>{overallPct.toFixed(0)}%</span>
          </div>
          <div style={s.progBg}>
            <div style={{...s.progFill, width:`${overallPct}%`, background:"var(--teal)"}} />
          </div>
          <div style={s.overallBot}>
            <span style={{color:"var(--teal)",fontFamily:"var(--font-d)",fontSize:13,fontWeight:700}}>{fmt(totalSaved)}</span>
            <span style={{color:"var(--text3)",fontFamily:"var(--font-m)",fontSize:11}}> saved of {fmt(totalTarget)}</span>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={s.form} className="au">
          <div style={s.formTitle}>{editItem?"Edit Goal":"New Goal"}</div>

          {/* Icon picker */}
          <div style={s.iconRow}>
            {GOAL_ICONS.map(ic=>(
              <button key={ic} style={{...s.iconBtn, ...(form.icon===ic?{background:"var(--bg4)",border:"1px solid var(--border3)"}:{})}}
                onClick={()=>setForm(f=>({...f,icon:ic}))}>
                {ic}
              </button>
            ))}
          </div>

          <div style={s.formRow}>
            <Field label="Goal Name" style={{flex:2}}>
              <input style={s.inp} placeholder="e.g. Emergency Fund" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </Field>
            <Field label="Target (₹)" style={{flex:1}}>
              <input style={s.inp} type="number" placeholder="100000" value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))} />
            </Field>
            <Field label="Saved So Far (₹)" style={{flex:1}}>
              <input style={s.inp} type="number" placeholder="0" value={form.saved} onChange={e=>setForm(f=>({...f,saved:e.target.value}))} />
            </Field>
          </div>

          <div style={s.formRow}>
            <Field label="Target Date" style={{flex:1}}>
              <input style={s.inp} type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} />
            </Field>
            <Field label="Accent Color" style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input style={{...s.inp,width:44,padding:2,cursor:"pointer"}} type="color" value={form.color}
                  onChange={e=>setForm(f=>({...f,color:e.target.value}))} />
                <span style={{fontFamily:"var(--font-m)",fontSize:11,color:"var(--text3)"}}>{form.color}</span>
              </div>
            </Field>
          </div>

          <button style={s.submitBtn} onClick={submit} disabled={busy}>
            {busy?"Saving…":editItem?"Update Goal":"Create Goal"}
          </button>
        </div>
      )}

      {goals.length===0 && !showForm ? (
        <div style={s.empty}>
          <div style={s.emptyIco}>◉</div>
          <div style={s.emptyTxt}>No goals set</div>
          <div style={s.emptySub}>Create savings targets to stay motivated</div>
        </div>
      ) : (
        <div style={s.grid}>
          {goals.map((g,i)=>{
            const pct   = Math.min((parseFloat(g.saved)/parseFloat(g.target))*100,100);
            const color = g.color||"var(--teal)";
            const done  = pct>=100;
            const days  = g.deadline ? Math.ceil((new Date(g.deadline)-new Date())/(1000*60*60*24)) : null;

            return (
              <div key={g.id} className="au" style={{...s.card, animationDelay:`${i*0.05}s`}}>
                <div style={s.cardTop}>
                  <div style={{...s.goalIco, background:`${color}18`}}>{g.icon||"🎯"}</div>
                  <div style={{flex:1}}>
                    <div style={s.goalName}>{g.name}</div>
                    {days!==null && (
                      <div style={{...s.daysLeft, color:days<30?"var(--red)":days<90?"var(--amber)":"var(--text3)"}}>
                        {days>0?`${days}d left`:done?"Achieved! 🎉":"Deadline passed"}
                      </div>
                    )}
                  </div>
                  {done && <span style={s.doneBadge}>✓</span>}
                  <button style={s.editBtn} onClick={()=>openEdit(g)}>✎</button>
                  <button style={s.delBtn}  onClick={()=>onDelete(g.id)}>✕</button>
                </div>

                {/* Circular-like progress shown as thick bar */}
                <div style={s.progBg}>
                  <div style={{...s.progFill, width:`${pct}%`, background:color, opacity:done?1:0.8}} />
                </div>
                <div style={s.pctRow}>
                  <span style={{...s.pctTxt, color}}>{pct.toFixed(0)}%</span>
                  <span style={s.amtTxt}>{fmt(g.saved)} / {fmt(g.target)}</span>
                </div>

                {/* Add saved amount */}
                {addSavedId===g.id ? (
                  <div style={s.addSavedRow}>
                    <input style={{...s.inp, flex:1, padding:"7px 10px"}} type="number" placeholder="Amount to add"
                      value={addAmt} onChange={e=>setAddAmt(e.target.value)} autoFocus />
                    <button style={s.saveAddBtn} onClick={()=>addSaved(g)}>+ Add</button>
                    <button style={s.cancelAddBtn} onClick={()=>{ setAddSavedId(null);setAddAmt(""); }}>✕</button>
                  </div>
                ) : (
                  <button style={{...s.contributeBtn, border:`1px solid ${color}30`, color}} onClick={()=>setAddSavedId(g.id)}>
                    + Add Savings
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, children, style={} }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
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
  overallCard:{background:"var(--bg2)",border:"1px solid var(--teal3)",borderRadius:"var(--r)",padding:"14px 18px",marginBottom:16,display:"flex",flexDirection:"column",gap:8},
  overallTop:{display:"flex",justifyContent:"space-between"},
  overallLbl:{fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase"},
  overallPct:{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,color:"var(--teal)"},
  overallBot:{},
  progBg:{height:6,background:"var(--bg3)",borderRadius:99,overflow:"hidden"},
  progFill:{height:"100%",borderRadius:99,transition:"width 0.7s cubic-bezier(.4,0,.2,1)"},
  form:{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"var(--r)",padding:"18px 20px",marginBottom:16,display:"flex",flexDirection:"column",gap:14},
  formTitle:{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700},
  iconRow:{display:"flex",gap:6,flexWrap:"wrap"},
  iconBtn:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r2)",fontSize:18,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.14s"},
  formRow:{display:"flex",gap:12,flexWrap:"wrap"},
  inp:{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text)",fontFamily:"var(--font-b)",fontSize:13,padding:"9px 12px",width:"100%"},
  submitBtn:{background:"linear-gradient(135deg,var(--teal3),var(--teal))",border:"none",borderRadius:"var(--r2)",color:"#fff",fontSize:13,fontWeight:600,padding:"9px 22px",alignSelf:"flex-start"},
  empty:{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 0",gap:10},
  emptyIco:{fontSize:36,color:"var(--text4)"},
  emptyTxt:{fontSize:14,fontWeight:600,color:"var(--text2)"},
  emptySub:{fontFamily:"var(--font-m)",fontSize:11,color:"var(--text3)"},
  grid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12},
  card:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"16px 18px",display:"flex",flexDirection:"column",gap:10},
  cardTop:{display:"flex",alignItems:"center",gap:10},
  goalIco:{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19},
  goalName:{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700},
  daysLeft:{fontFamily:"var(--font-m)",fontSize:9,marginTop:2},
  doneBadge:{background:"rgba(52,211,153,0.15)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:99,color:"var(--green)",fontFamily:"var(--font-m)",fontSize:10,padding:"2px 8px"},
  editBtn:{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:7,color:"var(--teal2)",fontSize:12,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center"},
  delBtn:{background:"transparent",border:"1px solid var(--border)",borderRadius:7,color:"rgba(248,113,113,0.35)",fontSize:10,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center"},
  pctRow:{display:"flex",justifyContent:"space-between",alignItems:"baseline"},
  pctTxt:{fontFamily:"var(--font-d)",fontSize:18,fontWeight:700,letterSpacing:"-0.5px"},
  amtTxt:{fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)"},
  addSavedRow:{display:"flex",gap:6,alignItems:"center"},
  saveAddBtn:{background:"var(--teal3)",border:"none",borderRadius:"var(--r2)",color:"#fff",fontFamily:"var(--font-m)",fontSize:11,padding:"7px 12px",flexShrink:0},
  cancelAddBtn:{background:"transparent",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text3)",fontFamily:"var(--font-m)",fontSize:11,padding:"7px 10px",flexShrink:0},
  contributeBtn:{background:"transparent",borderRadius:"var(--r2)",fontFamily:"var(--font-m)",fontSize:11,padding:"7px",letterSpacing:"0.04em",transition:"all 0.15s"},
};