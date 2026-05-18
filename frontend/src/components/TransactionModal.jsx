import { useState, useEffect } from "react";
import { CATEGORIES, INCOME_CATS, todayStr } from "../utils/helpers";

const BLANK = {
  title:"", amount:"", transaction_type:"expense",
  category:"Food", note:"", date: todayStr(),
  recurring:"none", tags:"",
};

export default function TransactionModal({ open, onClose, onSubmit, editItem }) {
  const [form, setForm]   = useState(BLANK);
  const [busy, setBusy]   = useState(false);
  const [err,  setErr]    = useState("");

  useEffect(()=>{
    if(open) {
      setForm(editItem ? {
        title:editItem.title, amount:editItem.amount,
        transaction_type:editItem.transaction_type,
        category:editItem.category, note:editItem.note||"",
        date:editItem.date||todayStr(),
        recurring:editItem.recurring||"none",
        tags:editItem.tags||"",
      } : BLANK);
      setErr("");
    }
  },[open,editItem]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    if(!form.title.trim()) return setErr("Title required");
    if(!form.amount || parseFloat(form.amount)<=0) return setErr("Enter a valid amount");
    setBusy(true); setErr("");
    try { await onSubmit(form); onClose(); }
    catch(e) { setErr(e.message||"Error saving"); }
    finally { setBusy(false); }
  };

  if(!open) return null;

  const isIncome = form.transaction_type==="income";
  const catList  = isIncome
    ? CATEGORIES.filter(c=>INCOME_CATS.includes(c.name))
    : CATEGORIES.filter(c=>!["Salary","Freelance","Investment"].includes(c.name));

  const accentColor = isIncome ? "var(--teal)" : "var(--amber)";
  const accentBg    = isIncome ? "rgba(45,212,191,0.08)" : "rgba(251,191,36,0.08)";

  return (
    <div style={ov.wrap} onClick={onClose}>
      <div style={ov.sheet} className="as" onClick={e=>e.stopPropagation()}>
        <div style={ov.pill} />

        {/* Header */}
        <div style={ov.hdr}>
          <div style={{...ov.hdrIcon, background:accentBg, color:accentColor}}>
            {isIncome?"↑":"↓"}
          </div>
          <div>
            <div style={ov.hdrTitle}>{editItem?"Edit":"New"} Transaction</div>
            <div style={ov.hdrSub}>Fill in the details below</div>
          </div>
          <button style={ov.xBtn} onClick={onClose}>✕</button>
        </div>

        {/* Type toggle */}
        <div style={ov.toggle}>
          {["expense","income"].map(t=>(
            <button key={t}
              style={{
                ...ov.tBtn,
                ...(form.transaction_type===t ? {
                  background: t==="income"?"rgba(45,212,191,0.12)":"rgba(251,191,36,0.12)",
                  border:`1px solid ${t==="income"?"var(--teal3)":"var(--amber2)"}`,
                  color: t==="income"?"var(--teal)":"var(--amber)",
                  fontWeight:600,
                }:{})
              }}
              onClick={()=>{ set("transaction_type",t); set("category",t==="income"?"Salary":"Food"); }}
            >
              <span>{t==="income"?"↑":"↓"}</span>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        <div style={ov.body}>
          {/* Title */}
          <Label text="Title">
            <input style={ov.inp} placeholder="e.g. Monthly Salary, Netflix…"
              value={form.title} onChange={e=>set("title",e.target.value)} />
          </Label>

          {/* Amount + Date */}
          <div style={ov.row}>
            <Label text="Amount (₹)" style={{flex:1}}>
              <div style={{position:"relative"}}>
                <span style={ov.prefix}>₹</span>
                <input style={{...ov.inp, paddingLeft:28}} type="number" placeholder="0"
                  value={form.amount} onChange={e=>set("amount",e.target.value)} />
              </div>
            </Label>
            <Label text="Date" style={{flex:1}}>
              <input style={ov.inp} type="date" value={form.date}
                onChange={e=>set("date",e.target.value)} />
            </Label>
          </div>

          {/* Category grid */}
          <Label text="Category">
            <div style={ov.catGrid}>
              {catList.map(c=>(
                <button key={c.name}
                  style={{
                    ...ov.catBtn,
                    ...(form.category===c.name ? {
                      background:`${c.color}18`,
                      border:`1px solid ${c.color}50`,
                      color:c.color,
                    }:{})
                  }}
                  onClick={()=>set("category",c.name)}
                >
                  <span style={{fontSize:17}}>{c.icon}</span>
                  <span style={ov.catLbl}>{c.name}</span>
                </button>
              ))}
            </div>
          </Label>

          {/* Recurring */}
          <Label text="Recurring">
            <div style={ov.recRow}>
              {["none","daily","weekly","monthly","yearly"].map(r=>(
                <button key={r}
                  style={{
                    ...ov.recBtn,
                    ...(form.recurring===r ? {
                      background:"var(--bg5)", border:"1px solid var(--border3)",
                      color:"var(--text)", fontWeight:600,
                    }:{})
                  }}
                  onClick={()=>set("recurring",r)}
                >
                  {r==="none"?"Once":r.charAt(0).toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>
          </Label>

          {/* Tags */}
          <Label text="Tags (comma separated)">
            <input style={ov.inp} placeholder="e.g. work, personal, tax"
              value={form.tags} onChange={e=>set("tags",e.target.value)} />
          </Label>

          {/* Note */}
          <Label text="Note (optional)">
            <textarea style={ov.ta} rows={2} placeholder="Any extra notes…"
              value={form.note} onChange={e=>set("note",e.target.value)} />
          </Label>

          {err && <div style={ov.err}>{err}</div>}

          <button
            style={{
              ...ov.submit,
              background: isIncome
                ? "linear-gradient(135deg,var(--teal3),var(--teal))"
                : "linear-gradient(135deg,var(--amber2),var(--amber))",
              opacity: busy ? 0.7 : 1,
            }}
            onClick={submit} disabled={busy}
          >
            {busy ? "Saving…" : editItem ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ text, children, style={} }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:7,...style}}>
      <label style={{fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",letterSpacing:"0.14em",textTransform:"uppercase"}}>
        {text}
      </label>
      {children}
    </div>
  );
}

const ov = {
  wrap: {
    position:"fixed", inset:0, zIndex:200,
    background:"rgba(0,0,0,0.72)", backdropFilter:"blur(10px)",
    display:"flex", alignItems:"flex-end", justifyContent:"center",
  },
  sheet: {
    background:"var(--bg2)", border:"1px solid var(--border2)",
    borderRadius:"22px 22px 0 0",
    width:"100%", maxWidth:520, maxHeight:"92vh",
    overflowY:"auto", padding:"6px 0 0",
  },
  pill: { width:36,height:4,background:"var(--border3)",borderRadius:99,margin:"10px auto 16px" },
  hdr: { display:"flex",alignItems:"center",gap:12,padding:"0 20px 16px",borderBottom:"1px solid var(--border)" },
  hdrIcon: { width:40,height:40,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,flexShrink:0 },
  hdrTitle: { fontFamily:"var(--font-d)",fontSize:16,fontWeight:700 },
  hdrSub: { fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)",marginTop:2 },
  xBtn: { marginLeft:"auto",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text3)",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 },
  toggle: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"16px 20px 0" },
  tBtn: { display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"11px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r)",color:"var(--text2)",fontSize:13,transition:"all 0.15s" },
  body: { padding:"16px 20px 36px",display:"flex",flexDirection:"column",gap:16 },
  row: { display:"flex",gap:12 },
  inp: { width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text)",fontSize:13,padding:"10px 12px",transition:"border-color 0.2s" },
  prefix: { position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--text2)",fontSize:14,fontWeight:600,pointerEvents:"none" },
  catGrid: { display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7 },
  catBtn: { display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"9px 4px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r)",color:"var(--text2)",transition:"all 0.15s" },
  catLbl: { fontSize:9,fontFamily:"var(--font-m)",letterSpacing:"0.03em" },
  recRow: { display:"flex",gap:6,flexWrap:"wrap" },
  recBtn: { padding:"6px 12px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:99,color:"var(--text3)",fontFamily:"var(--font-m)",fontSize:10,letterSpacing:"0.05em",transition:"all 0.15s" },
  ta: { width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text)",fontSize:13,padding:"10px 12px",resize:"vertical",fontFamily:"var(--font-b)" },
  err: { background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:"var(--r2)",color:"var(--red)",fontSize:12,fontFamily:"var(--font-m)",padding:"10px 14px" },
  submit: { border:"none",borderRadius:"var(--r)",color:"#fff",fontSize:14,fontWeight:600,padding:"14px",cursor:"pointer",transition:"opacity 0.2s",marginTop:4,letterSpacing:"-0.2px" },
};