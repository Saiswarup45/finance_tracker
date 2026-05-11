import SummaryCards from "./SummaryCards";
import Charts from "./Charts";
import TransactionItem from "./TransactionItem";
import { formatCurrency } from "../utils/helpers";

export default function Dashboard({
  transactions, balance, income, expense,
  monthlyIncome, monthlyExpense,
  onEdit, onDelete, onAddClick,
}) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });

  const thisMonthExp = thisMonth.filter((t) => t.transaction_type === "expense").reduce((s, t) => s + parseFloat(t.amount), 0);
  const lastMonthExp = lastMonth.filter((t) => t.transaction_type === "expense").reduce((s, t) => s + parseFloat(t.amount), 0);
  const expDiff = lastMonthExp > 0 ? ((thisMonthExp - lastMonthExp) / lastMonthExp) * 100 : 0;

  return (
    <div>
      <SummaryCards
        balance={balance}
        income={income}
        expense={expense}
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
      />

      {/* Month vs Last Month */}
      <div style={s.insightsRow}>
        <div style={s.insight} className="animate-fade-up delay-1">
          <div style={s.insightLabel}>vs Last Month</div>
          <div style={{ ...s.insightVal, color: expDiff <= 0 ? "var(--green)" : "var(--red)" }}>
            {expDiff > 0 ? "+" : ""}{expDiff.toFixed(1)}%
          </div>
          <div style={s.insightSub}>in expenses</div>
        </div>
        <div style={s.insight} className="animate-fade-up delay-2">
          <div style={s.insightLabel}>This Month Txns</div>
          <div style={s.insightVal}>{thisMonth.length}</div>
          <div style={s.insightSub}>transactions</div>
        </div>
        <div style={s.insight} className="animate-fade-up delay-3">
          <div style={s.insightLabel}>Avg. Expense</div>
          <div style={s.insightVal}>
            {thisMonth.filter((t) => t.transaction_type === "expense").length > 0
              ? formatCurrency(thisMonthExp / thisMonth.filter((t) => t.transaction_type === "expense").length)
              : "—"}
          </div>
          <div style={s.insightSub}>per transaction</div>
        </div>
        <div style={s.insight} className="animate-fade-up delay-4">
          <div style={s.insightLabel}>Total Entries</div>
          <div style={s.insightVal}>{transactions.length}</div>
          <div style={s.insightSub}>all time</div>
        </div>
      </div>

      {/* Charts */}
      <Charts transactions={transactions} />

      {/* Recent Transactions */}
      <div style={s.recentWrap}>
        <div style={s.recentHeader}>
          <div style={s.recentTitle}>Recent Transactions</div>
          <button style={s.viewAllBtn} onClick={onAddClick}>+ Add New</button>
        </div>
        <div style={s.recentList}>
          {recent.length === 0 ? (
            <div style={s.empty}>No transactions yet. Add your first one!</div>
          ) : (
            recent.map((t, i) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={onEdit}
                onDelete={onDelete}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  insightsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    padding: "16px 24px 0",
  },
  insight: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  insightLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    color: "var(--text3)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  insightVal: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-1px",
    color: "var(--text)",
  },
  insightSub: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    color: "var(--text3)",
  },
  recentWrap: { padding: "20px 24px 0" },
  recentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  recentTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.3px",
  },
  viewAllBtn: {
    background: "transparent",
    border: "1px solid var(--border2)",
    borderRadius: 7,
    color: "var(--accent2)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    padding: "6px 14px",
    cursor: "pointer",
  },
  recentList: { display: "flex", flexDirection: "column", gap: 8 },
  empty: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "var(--text3)",
  },
};