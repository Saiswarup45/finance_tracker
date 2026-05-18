import { fmt, fmtCompact } from "../utils/helpers";

export default function SummaryCards({ balance, income, expense, monthlyIncome, monthlyExpense, savingsRate, txnCount }) {
  const cards = [
    {
      label:"Net Balance", value:fmt(balance),
      color: balance>=0 ? "var(--teal)" : "var(--red)",
      bg: balance>=0 ? "rgba(45,212,191,0.06)" : "rgba(248,113,113,0.06)",
      border: balance>=0 ? "var(--teal3)" : "var(--red)",
      icon: balance>=0 ? "▲" : "▼",
      sub: `${txnCount} transactions total`,
      wide: true,
    },
    {
      label:"Total Income", value:fmtCompact(income),
      color:"var(--green)", bg:"rgba(52,211,153,0.05)", border:"rgba(52,211,153,0.2)",
      icon:"↑", sub:`This month: ${fmtCompact(monthlyIncome)}`,
    },
    {
      label:"Total Expense", value:fmtCompact(expense),
      color:"var(--red)", bg:"rgba(248,113,113,0.05)", border:"rgba(248,113,113,0.2)",
      icon:"↓", sub:`This month: ${fmtCompact(monthlyExpense)}`,
    },
    {
      label:"Savings Rate", value:`${savingsRate}%`,
      color: savingsRate>=20?"var(--teal)":savingsRate>=10?"var(--amber)":"var(--red)",
      bg:"rgba(251,191,36,0.04)", border:"rgba(251,191,36,0.15)",
      icon:"◎",
      sub: savingsRate>=20?"Excellent!":savingsRate>=10?"Room to improve":"Needs attention",
    },
  ];

  return (
    <div style={s.grid}>
      {cards.map((c,i)=>(
        <div
          key={c.label}
          className={`au d${i+1}`}
          style={{
            ...s.card, ...(c.wide?s.wide:{}),
            background:c.bg, border:`1px solid ${c.border}`,
          }}
        >
          <div style={s.top}>
            <span style={s.label}>{c.label}</span>
            <span style={{...s.icon, color:c.color}}>{c.icon}</span>
          </div>
          <div style={{...s.value, color:c.color}}>{c.value}</div>
          <div style={s.sub}>{c.sub}</div>
          {/* Glow blob */}
          <div style={{...s.blob, background:c.color}} />
        </div>
      ))}
    </div>
  );
}

const s = {
  grid: {
    display:"grid",
    gridTemplateColumns:"repeat(4,1fr)",
    gap:12,
    padding:"20px 20px 0",
  },
  card: {
    position:"relative", overflow:"hidden",
    borderRadius:"var(--r)", padding:"18px 18px 14px",
    transition:"transform 0.2s, box-shadow 0.2s",
  },
  wide: { gridColumn:"1/-1" },
  top: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 },
  label: { fontFamily:"var(--font-m)", fontSize:9, color:"var(--text3)", letterSpacing:"0.12em", textTransform:"uppercase" },
  icon: { fontSize:17, fontWeight:700 },
  value: { fontFamily:"var(--font-d)", fontSize:28, fontWeight:700, letterSpacing:"-1px", lineHeight:1, marginBottom:6 },
  sub: { fontFamily:"var(--font-m)", fontSize:10, color:"var(--text3)", letterSpacing:"0.04em" },
  blob: { position:"absolute", bottom:-24, right:-16, width:80, height:80, borderRadius:"50%", opacity:0.07, filter:"blur(18px)" },
};

// Responsive override via JS
const mq = typeof window!=="undefined" && window.innerWidth < 768;
if(mq) {
  s.grid.gridTemplateColumns = "1fr 1fr";
  s.wide.gridColumn = "1/-1";
}