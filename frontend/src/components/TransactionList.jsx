import { useState } from "react";
import TransactionItem from "./TransactionItem";
import { CATEGORIES } from "../utils/helpers";

export default function TransactionList({ transactions, onEdit, onDelete, onAdd }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filtered = transactions
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(search.toLowerCase()));
      const matchType = filter === "all" || t.transaction_type === filter;
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      return matchSearch && matchType && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "amount") return parseFloat(b.amount) - parseFloat(a.amount);
      return a.title.localeCompare(b.title);
    });

  return (
    <div style={s.wrap}>
      {/* Toolbar */}
      <div style={s.toolbar}>
        {/* Search */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.searchInput}
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={s.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* Filters Row */}
        <div style={s.filters}>
          <div style={s.filterGroup}>
            {["all", "income", "expense"].map((f) => (
              <button
                key={f}
                style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>

          <select
            style={s.select}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>

          <select
            style={s.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
            <option value="title">Sort: Name</option>
          </select>

          <button style={s.addBtn} onClick={onAdd}>+ Add</button>
        </div>
      </div>

      {/* Count */}
      <div style={s.countRow}>
        <span style={s.count}>{filtered.length} transaction{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* List */}
      <div style={s.list}>
        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>◌</div>
            <div style={s.emptyText}>No transactions found</div>
            <div style={s.emptySub}>Try adjusting your filters or add a new transaction</div>
          </div>
        ) : (
          filtered.map((t, i) => (
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
  );
}

const s = {
  wrap: { padding: "20px 24px" },
  toolbar: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    fontSize: 18,
    color: "var(--text3)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text)",
    fontSize: 14,
    padding: "10px 40px 10px 38px",
    transition: "border-color 0.2s",
  },
  clearBtn: {
    position: "absolute",
    right: 10,
    background: "transparent",
    border: "none",
    color: "var(--text3)",
    fontSize: 12,
    cursor: "pointer",
    padding: 4,
  },
  filters: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    overflow: "hidden",
  },
  filterBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text2)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    padding: "7px 14px",
    cursor: "pointer",
    transition: "all 0.15s",
    letterSpacing: "0.05em",
    borderRight: "1px solid var(--border)",
  },
  filterBtnActive: {
    background: "var(--border2)",
    color: "var(--text)",
  },
  select: {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text2)",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    padding: "7px 12px",
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
  addBtn: {
    marginLeft: "auto",
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    padding: "8px 18px",
    boxShadow: "0 0 16px rgba(99,102,241,0.3)",
    transition: "opacity 0.2s",
  },
  countRow: { marginBottom: 12 },
  count: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text3)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 24px",
    gap: 10,
  },
  emptyIcon: { fontSize: 40, color: "var(--text3)" },
  emptyText: { fontSize: 15, fontWeight: 600, color: "var(--text2)" },
  emptySub: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--text3)",
    textAlign: "center",
  },
};