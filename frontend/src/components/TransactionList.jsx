import { useState } from "react";
import TransactionItem from "./TransactionItem";
import { CATEGORIES, fmtDate } from "../utils/helpers";

function exportCSV(transactions) {
  const rows = [
    ["ID","Title","Amount","Type","Category","Date","Note","Recurring","Tags"],
    ...transactions.map(t=>[
      t.id, t.title, t.amount, t.transaction_type, t.category,
      fmtDate(t.date), t.note||"", t.recurring||"", t.tags||"",
    ])
  ];
  const csv = rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download="transactions.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function TransactionList({ transactions, onEdit, onDelete, onAdd }) {
  const [q,   setQ]   = useState("");
  const [type,setType]= useState("all");
  const [cat, setCat] = useState("all");
  const [sort,setSort]= useState("date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = transactions
    .filter(t=>{
      if(q) {
        const lq=q.toLowerCase();
        if(!t.title.toLowerCase().includes(lq) &&
           !t.category.toLowerCase().includes(lq) &&
           !(t.note||"").toLowerCase().includes(lq) &&
           !(t.tags||"").toLowerCase().includes(lq)) return false;
      }
      if(type!=="all" && t.transaction_type!==type) return false;
      if(cat!=="all"  && t.category!==cat)           return false;
      if(dateFrom && new Date(t.date)<new Date(dateFrom)) return false;
      if(dateTo   && new Date(t.date)>new Date(dateTo))   return false;
      return true;
    })
    .sort((a,b)=>{
      if(sort==="date")   return new Date(b.date)-new Date(a.date);
      if(sort==="amount") return parseFloat(b.amount)-parseFloat(a.amount);
      return a.title.localeCompare(b.title);
    });

  const totalFiltered = filtered.reduce((s,t)=>
    s + (t.transaction_type==="income"?1:-1)*parseFloat(t.amount), 0
  );

  return (
    <div style={s.wrap}>
      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchRow}>
          <div style={s.searchBox}>
            <span style={s.searchIco}>⌕</span>
            <input style={s.searchInp} placeholder="Search by title, category, tags…"
              value={q} onChange={e=>setQ(e.target.value)} />
            {q && <button style={s.clearBtn} onClick={()=>setQ("")}>✕</button>}
          </div>
          <button style={s.filterToggle} onClick={()=>setShowFilters(v=>!v)}>
            ⚙ {showFilters?"Hide":"Filters"}
          </button>
          <button style={s.exportBtn} onClick={()=>exportCSV(filtered)}>
            ↓ CSV
          </button>
          <button style={s.addBtn} onClick={onAdd}>+ Add</button>
        </div>

        {showFilters && (
          <div style={s.filters} className="au">
            {/* Type */}
            <div style={s.filterGroup}>
              {["all","income","expense"].map(f=>(
                <button key={f}
                  style={{...s.fBtn, ...(type===f?s.fBtnA:{})}}
                  onClick={()=>setType(f)}
                >
                  {f==="all"?"All":f==="income"?"↑ Income":"↓ Expense"}
                </button>
              ))}
            </div>
            {/* Category */}
            <select style={s.sel} value={cat} onChange={e=>setCat(e.target.value)}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(c=><option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
            {/* Sort */}
            <select style={s.sel} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="date">Date ↓</option>
              <option value="amount">Amount ↓</option>
              <option value="title">Name A–Z</option>
            </select>
            {/* Date range */}
            <input style={s.dateInp} type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} title="From date" />
            <input style={s.dateInp} type="date" value={dateTo}   onChange={e=>setDateTo(e.target.value)}   title="To date" />
            <button style={s.resetBtn} onClick={()=>{ setType("all");setCat("all");setSort("date");setDateFrom("");setDateTo(""); }}>
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={s.statsRow}>
        <span style={s.countTxt}>{filtered.length} result{filtered.length!==1?"s":""}</span>
        <span style={{...s.totalTxt, color:totalFiltered>=0?"var(--teal)":"var(--red)"}}>
          Net: {totalFiltered>=0?"+":""}{new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(totalFiltered)}
        </span>
      </div>

      {/* List */}
      <div style={s.list}>
        {filtered.length===0 ? (
          <div style={s.empty}>
            <div style={s.emptyIco}>◌</div>
            <div style={s.emptyTxt}>No transactions found</div>
            <div style={s.emptySub}>Adjust filters or add a new transaction</div>
          </div>
        ) : filtered.map((t,i)=>(
          <TransactionItem key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} idx={i} />
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap:{padding:"16px 20px"},
  toolbar:{display:"flex",flexDirection:"column",gap:10,marginBottom:12},
  searchRow:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"},
  searchBox:{position:"relative",flex:"1 1 200px",display:"flex",alignItems:"center"},
  searchIco:{position:"absolute",left:10,fontSize:17,color:"var(--text3)",pointerEvents:"none"},
  searchInp:{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text)",fontSize:13,padding:"9px 32px 9px 34px"},
  clearBtn:{position:"absolute",right:8,background:"transparent",border:"none",color:"var(--text3)",fontSize:11,padding:4},
  filterToggle:{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"var(--r2)",color:"var(--text2)",fontFamily:"var(--font-m)",fontSize:11,padding:"8px 12px",whiteSpace:"nowrap"},
  exportBtn:{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:"var(--r2)",color:"var(--teal2)",fontFamily:"var(--font-m)",fontSize:11,padding:"8px 12px",whiteSpace:"nowrap"},
  addBtn:{background:"linear-gradient(135deg,var(--teal3),var(--teal))",border:"none",borderRadius:"var(--r2)",color:"#fff",fontSize:12,fontWeight:600,padding:"8px 16px",boxShadow:"0 0 12px rgba(45,212,191,0.3)",whiteSpace:"nowrap"},
  filters:{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",padding:"10px 14px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r)"},
  filterGroup:{display:"flex",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r2)",overflow:"hidden"},
  fBtn:{background:"transparent",border:"none",borderRight:"1px solid var(--border)",color:"var(--text3)",fontFamily:"var(--font-m)",fontSize:10,padding:"6px 12px",letterSpacing:"0.05em"},
  fBtnA:{background:"var(--bg4)",color:"var(--text)"},
  sel:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text2)",fontFamily:"var(--font-m)",fontSize:10,padding:"6px 10px"},
  dateInp:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text2)",fontFamily:"var(--font-m)",fontSize:10,padding:"6px 10px"},
  resetBtn:{background:"transparent",border:"1px solid var(--border)",borderRadius:"var(--r2)",color:"var(--text3)",fontFamily:"var(--font-m)",fontSize:10,padding:"6px 12px"},
  statsRow:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10},
  countTxt:{fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase"},
  totalTxt:{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700},
  list:{display:"flex",flexDirection:"column",gap:7},
  empty:{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 0",gap:10},
  emptyIco:{fontSize:38,color:"var(--text4)"},
  emptyTxt:{fontSize:14,fontWeight:600,color:"var(--text2)"},
  emptySub:{fontFamily:"var(--font-m)",fontSize:11,color:"var(--text3)"},
};