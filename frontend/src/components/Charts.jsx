import { groupByMonth, groupByCategory, formatCurrency } from "../utils/helpers";

export default function Charts({ transactions }) {
  const monthly = groupByMonth(transactions);
  const expenseByCategory = groupByCategory(transactions, "expense");
  const incomeByCategory = groupByCategory(transactions, "income");

  const maxMonthly = Math.max(...monthly.map((m) => Math.max(m.income, m.expense)), 1);
  const totalExpense = expenseByCategory.reduce((s, c) => s + c.amount, 0);

  return (
    <div style={s.wrap}>
      {/* Monthly Bar Chart */}
      <div style={s.card} className="animate-fade-up delay-1">
        <div style={s.cardHeader}>
          <div style={s.cardTitle}>Monthly Overview</div>
          <div style={s.legend}>
            <span style={s.legendItem}><span style={{ ...s.dot, background: "var(--green)" }} />Income</span>
            <span style={s.legendItem}><span style={{ ...s.dot, background: "var(--red)" }} />Expense</span>
          </div>
        </div>
        {monthly.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={s.barChart}>
            {monthly.map((m, i) => (
              <div key={i} style={s.barGroup}>
                <div style={s.barPair}>
                  <div style={s.barWrap}>
                    <div
                      style={{
                        ...s.bar,
                        height: `${(m.income / maxMonthly) * 100}%`,
                        background: "var(--green)",
                        opacity: 0.85,
                      }}
                      title={formatCurrency(m.income)}
                    />
                  </div>
                  <div style={s.barWrap}>
                    <div
                      style={{
                        ...s.bar,
                        height: `${(m.expense / maxMonthly) * 100}%`,
                        background: "var(--red)",
                        opacity: 0.85,
                      }}
                      title={formatCurrency(m.expense)}
                    />
                  </div>
                </div>
                <div style={s.barLabel}>{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense Categories */}
      <div style={s.card} className="animate-fade-up delay-2">
        <div style={s.cardHeader}>
          <div style={s.cardTitle}>Expense Breakdown</div>
          <div style={s.totalLabel}>{formatCurrency(totalExpense)}</div>
        </div>
        {expenseByCategory.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={s.catList}>
            {expenseByCategory.slice(0, 6).map((cat, i) => {
              const pct = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
              return (
                <div key={cat.name} style={s.catRow}>
                  <div style={s.catLeft}>
                    <span style={{ fontSize: 18 }}>{cat.meta.icon}</span>
                    <span style={s.catName}>{cat.name}</span>
                  </div>
                  <div style={s.catRight}>
                    <div style={s.barBg}>
                      <div
                        style={{
                          ...s.barFill,
                          width: `${pct}%`,
                          background: cat.meta.color,
                        }}
                      />
                    </div>
                    <span style={{ ...s.catPct, color: cat.meta.color }}>
                      {pct.toFixed(0)}%
                    </span>
                    <span style={s.catAmt}>{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Donut-style summary */}
      <div style={s.card} className="animate-fade-up delay-3">
        <div style={s.cardHeader}>
          <div style={s.cardTitle}>Income Sources</div>
        </div>
        {incomeByCategory.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={s.catList}>
            {incomeByCategory.map((cat) => {
              const total = incomeByCategory.reduce((s, c) => s + c.amount, 0);
              const pct = total > 0 ? (cat.amount / total) * 100 : 0;
              return (
                <div key={cat.name} style={s.catRow}>
                  <div style={s.catLeft}>
                    <span style={{ fontSize: 18 }}>{cat.meta.icon}</span>
                    <span style={s.catName}>{cat.name}</span>
                  </div>
                  <div style={s.catRight}>
                    <div style={s.barBg}>
                      <div style={{ ...s.barFill, width: `${pct}%`, background: cat.meta.color }} />
                    </div>
                    <span style={{ ...s.catPct, color: cat.meta.color }}>{pct.toFixed(0)}%</span>
                    <span style={s.catAmt}>{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
      No data yet
    </div>
  );
}

const s = {
  wrap: {
    padding: "20px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  card: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "20px 22px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 14,
    fontWeight: 700,
    color: "var(--text)",
  },
  legend: { display: "flex", gap: 14 },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text2)",
  },
  dot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block" },
  totalLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--text2)",
  },
  // Bar chart
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    height: 140,
    paddingBottom: 24,
    position: "relative",
  },
  barGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
  barPair: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    gap: 3,
    width: "100%",
  },
  barWrap: {
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: "4px 4px 0 0",
    minHeight: 2,
    transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  },
  barLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    color: "var(--text3)",
    marginTop: 6,
    letterSpacing: "0.05em",
  },
  // Category rows
  catList: { display: "flex", flexDirection: "column", gap: 12 },
  catRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  catLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 110,
  },
  catName: {
    fontFamily: "var(--font-display)",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--text)",
  },
  catRight: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  barBg: {
    flex: 1,
    height: 5,
    background: "var(--bg3)",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: 0.85,
  },
  catPct: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    minWidth: 28,
    textAlign: "right",
  },
  catAmt: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text2)",
    minWidth: 70,
    textAlign: "right",
  },
};