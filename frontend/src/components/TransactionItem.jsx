import { formatCurrency, formatDateShort, getCategoryMeta } from "../utils/helpers";
import CategoryBadge from "./CategoryBadge";

export default function TransactionItem({ transaction: t, onEdit, onDelete, index }) {
  const meta = getCategoryMeta(t.category);
  const isIncome = t.transaction_type === "income";

  return (
    <div
      className={`animate-fade-up`}
      style={{ ...s.item, animationDelay: `${index * 0.04}s` }}
    >
      {/* Icon */}
      <div style={{ ...s.icon, background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
        <span style={{ fontSize: 18 }}>{meta.icon}</span>
      </div>

      {/* Info */}
      <div style={s.info}>
        <div style={s.title}>{t.title}</div>
        <div style={s.meta}>
          <CategoryBadge category={t.category} size="sm" />
          <span style={s.dot}>·</span>
          <span style={s.date}>{formatDateShort(t.date)}</span>
          {t.note && (
            <>
              <span style={s.dot}>·</span>
              <span style={s.note} title={t.note}>{t.note}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}
      <div style={s.right}>
        <div style={{ ...s.amount, color: isIncome ? "var(--green)" : "var(--red)" }}>
          {isIncome ? "+" : "−"}{formatCurrency(t.amount)}
        </div>
        <div style={s.typeBadge}>
          <span style={{
            ...s.typeDot,
            background: isIncome ? "var(--green)" : "var(--red)",
          }} />
          {t.transaction_type}
        </div>
      </div>

      {/* Actions */}
      <div style={s.actions} className="item-actions">
        <button style={s.editBtn} onClick={() => onEdit(t)} title="Edit">
          ✎
        </button>
        <button style={s.deleteBtn} onClick={() => onDelete(t.id)} title="Delete">
          ✕
        </button>
      </div>
    </div>
  );
}

const s = {
  item: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    transition: "all 0.18s ease",
    position: "relative",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: 5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  dot: {
    color: "var(--text3)",
    fontSize: 12,
  },
  date: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text2)",
  },
  note: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text3)",
    maxWidth: 120,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 5,
    flexShrink: 0,
  },
  amount: {
    fontFamily: "var(--font-display)",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  typeBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    color: "var(--text3)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  typeDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    opacity: 0.7,
  },
  actions: {
    display: "flex",
    gap: 6,
    flexShrink: 0,
  },
  editBtn: {
    width: 30,
    height: 30,
    background: "var(--bg3)",
    border: "1px solid var(--border2)",
    borderRadius: 8,
    color: "var(--accent2)",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
  deleteBtn: {
    width: 30,
    height: 30,
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "#f43f5e60",
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },
};