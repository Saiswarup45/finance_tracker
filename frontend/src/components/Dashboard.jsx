import SummaryCards from "./SummaryCards";
import TransactionItem from "./TransactionItem";
import Charts from "./Charts";
import { fmt, fmtCompact, groupByCat } from "../utils/helpers";

export default function Dashboard({
  transactions, balance, income, expense,
  monthlyIncome, monthlyExpense, lastMonthExpense,
  savingsRate, thisMonthTxns,
  onEdit, onDelete, onAdd,
}) {
  const recent = [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const topCat = groupByCat(transactions,"expense")[0];

  const expDiff = lastMonthExpense>0
    ? ((monthlyExpense-lastMonthExpense)/lastMonthExpense)*100 : 0;

  const incomeTxns  = thisMonthTxns.filter(t=>t.transaction_type==="income");
  const expenseTxns = thisMonthTxns.filter(t=>t.transaction_type==="expense");
  const avgExp      = expenseTxns.length>0 ? monthlyExpense/expenseTxns.length : 0;

  return (
    <div>
      <SummaryCards
        balance={balance} income={income} expense={expense}
        monthlyIncome={monthlyIncome} monthlyExpense={monthlyExpense}
        savingsRate={savingsRate} txnCount={transactions.length}
      />

      {/* Insight strip */}
      <div style={s.strip}>
        <Insight icon="📅" label="This Month" val={thisMonthTxns.length+" txns"} />
        <Insight icon="📊" label="vs Last Month"
          val={(expDiff>0?"+":"")+expDiff.toFixed(0)+"%"}
          color={expDiff<=0?"var(--teal)":"var(--red)"} />
        <Insight icon="⌀" label="Avg Expense"    val={avgExp>0?fmtCompact(avgExp):"—"} />
        <Insight icon="🏆" label="Top Category"   val={topCat?topCat.name:"—"} />
        <Insight icon="📈" label="Monthly Savings" val={fmtCompact(monthlyIncome-monthlyExpense)}
          color={(monthlyIncome-monthlyExpense)>=0?"var(--teal)":"var(--red)"} />
      </div>

      {/* Charts */}
      <Charts transactions={transactions} />

      {/* Recent transactions */}
      <div style={s.recent}>
        <div style={s.recentHdr}>
          <div style={s.recentTitle}>Recent Activity</div>
          <button style={s.addBtn} onClick={onAdd}>+ New</button>
        </div>
        {recent.length===0 ? (
          <div style={s.empty}>No transactions yet — add your first one!</div>
        ) : (
          <div style={s.list}>
            {recent.map((t,i)=>(
              <TransactionItem key={t.id} t={t} onEdit={onEdit} onDelete={onDelete} idx={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Insight({ icon, label, val, color="var(--text)" }) {
  return (
    <div style={s.insight} className="au">
      <div style={s.insightIco}>{icon}</div>
      <div style={s.insightLbl}>{label}</div>
      <div style={{...s.insightVal, color}}>{val}</div>
    </div>
  );
}

const s = {
  strip:{display:"flex",gap:10,padding:"14px 20px 0",overflowX:"auto"},
  insight:{
    background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r)",
    padding:"12px 16px",display:"flex",flexDirection:"column",gap:4,
    minWidth:120,flexShrink:0,
  },
  insightIco:{fontSize:17},
  insightLbl:{fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase"},
  insightVal:{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700,letterSpacing:"-0.3px"},
  recent:{padding:"14px 20px 20px"},
  recentHdr:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},
  recentTitle:{fontFamily:"var(--font-d)",fontSize:15,fontWeight:700},
  addBtn:{background:"transparent",border:"1px solid var(--border2)",borderRadius:"var(--r2)",color:"var(--teal2)",fontFamily:"var(--font-m)",fontSize:11,padding:"6px 14px"},
  list:{display:"flex",flexDirection:"column",gap:7},
  empty:{textAlign:"center",padding:"30px",fontFamily:"var(--font-m)",fontSize:11,color:"var(--text4)"},
};