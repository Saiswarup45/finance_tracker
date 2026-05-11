import { useState } from "react";
import { CATEGORIES, formatCurrency } from "../utils/helpers";

export default function Budgets({ budgets, transactions, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "Food", limit: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [loading, setLoading] = useState(false);

  const getSpent = (category, month, year) =>
    transactions
      .filter((t) => {
        const d = new Date(t.date);
        return (
          t.transaction_type === "expense" &&
          t.category === category &&
          d.getMonth() + 1 === month &&
          d.getFullYear() === year
        );
      })
      .reduce((s, t) => s + parseFloat(t.amount), 0);

  const handleAdd = async () => {
    if (!form.limit || isNaN(form.limit)) return;
    setLoading(true);
    try {
      await onAdd(form);
      setShowForm(false);
      setForm({ category: "Food", limit: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.pageHeader}>
        <div>
          <div style={s.pageTitle}>Budgets</div>
          <div style={s.pageSub}>Set monthly spending limits per category</div>
        </div>
        <button style={s.addBtn} onClick={() => setShowForm((v) => !v)}>
          {showForm ? "✕ Cancel" : "+ New Budget"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={s.formCard} className="animate-fade-up">
          <div style={s.formTitle}>Create Budget</div>
          <div style={s.formRow}>
            <div style={s.formGroup}>
              <label style={s.label}>Category</label>
              <select
                style={s.select}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => !["Salary", "Freelance", "Investment"].includes(c.name)).map((c) => (
                  <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Monthly Limit (₹)</label>
              <input
                style={s.input}
                type="number"
                placeholder="5000"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
              />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Month</label>
              <select
                style={s.select}
                value={form.month}
                onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString("en-IN", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button style={s.submitBtn} onClick={handleAdd} disabled={loading}>
            {loading ? "Saving..." : "Create Budget"}
          </button>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>◎</div>
          <div style={s.emptyText}>No budgets set</div>
          <div style={s.emptySub}>Create a budget to track your spending limits</div>
        </div>
      ) : (
        <div style={s.grid}>
          {budgets.map((b, i) => {
            const spent = getSpent(b.category, b.month, b.year);
            const pct = Math.min((spent / parseFloat(b.limit)) * 100, 100);
            const cat = CATEGORIES.find((c) => c.name === b.category);
            const over = spent > parseFloat(b.limit);
            const warn = pct >= 80 && !over;
            const color = over ? "var(--red)" : warn ? "var(--yellow)" : "var(--green)";
            const monthName = new Date(2000, b.month - 1).toLocaleString("en-IN", { month: "long" });

            return (
              <div
                key={b.id}
                className="animate-fade-up"
                style={{ ...s.card, animationDelay: `${i * 0.06}s` }}
              >
                <div style={s.cardTop}>
                  <div style={s.cardLeft}>
                    <div style={{ ...s.catIcon, background: `${cat?.color || "#6366f1"}18` }}>
                      <span style={{ fontSize: 20 }}>{cat?.icon || "📦"}</span>
                    </div>
                    <div>
                      <div style={s.catName}>{b.category}</div>
                      <div style={s.monthTag}>{monthName} {b.year}</div>
                    </div>
                  </div>
                  <button style={s.deleteBtn} onClick={() => onDelete(b.id)}>✕</button>
                </div>

                {/* Progress bar */}
                <div style={s.progress}>
                  <div style={{ ...s.progressFill, width: `${pct}%`, background: color }} />
                </div>

                <div style={s.cardBottom}>
                  <div style={s.spentInfo}>
                    <span style={{ color, fontWeight: 600 }}>{formatCurrency(spent)}</span>
                    <span style={s.limitLabel}> / {formatCurrency(b.limit)}</span>
                  </div>
                  <div style={{ ...s.statusTag, color, background: `${color === "var(--red)" ? "#f43f5e" : color === "var(--yellow)" ? "#fbbf24" : "#10d9a0"}15` }}>
                    {over ? "Over budget!" : warn ? `${pct.toFixed(0)}% used` : `${pct.toFixed(0)}% used`}
                  </div>
                </div>

                {/* Remaining */}
                <div style={s.remaining}>
                  {over
                    ? <span style={{ color: "var(--red)" }}>Overspent by {formatCurrency(spent - parseFloat(b.limit))}</span>
                    : <span style={{ color: "var(--text3)" }}>Remaining: {formatCurrency(parseFloat(b.limit) - spent)}</span>
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

const s = {
  wrap: { padding: "20px 24px" },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pageTitle: { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" },
  pageSub: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", marginTop: 4 },
  addBtn: {
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    padding: "8px 18px",
    boxShadow: "0 0 16px rgba(99,102,241,0.3)",
  },
  formCard: {
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: 16,
    padding: "20px 22px",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  formTitle: { fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  formGroup: { display: "flex", flexDirection: "column", gap: 7 },
  label: { fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.12em", textTransform: "uppercase" },
  select: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontFamily: "var(--font-display)",
    fontSize: 13,
    padding: "9px 12px",
  },
  input: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontFamily: "var(--font-display)",
    fontSize: 13,
    padding: "9px 12px",
    width: "100%",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    padding: "12px",
    cursor: "pointer",
    alignSelf: "flex-start",
    padding: "10px 24px",
  },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 10 },
  emptyIcon: { fontSize: 40, color: "var(--text3)" },
  emptyText: { fontSize: 15, fontWeight: 600, color: "var(--text2)" },
  emptySub: { fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  card: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardLeft: { display: "flex", alignItems: "center", gap: 12 },
  catIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  catName: { fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 },
  monthTag: { fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 2 },
  deleteBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 6,
    color: "#f43f5e40",
    fontSize: 10,
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  progress: { height: 6, background: "var(--bg3)", borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99, transition: "width 0.6s ease" },
  cardBottom: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  spentInfo: { fontFamily: "var(--font-mono)", fontSize: 12 },
  limitLabel: { color: "var(--text3)", fontWeight: 400 },
  statusTag: {
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    padding: "4px 8px",
    borderRadius: 99,
    letterSpacing: "0.05em",
  },
  remaining: { fontFamily: "var(--font-mono)", fontSize: 10 },
};