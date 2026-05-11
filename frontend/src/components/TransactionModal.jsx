import { useState, useEffect } from "react";
import { CATEGORIES } from "../utils/helpers";

const EMPTY = {
  title: "",
  amount: "",
  transaction_type: "expense",
  category: "Other",
  note: "",
};

export default function TransactionModal({ isOpen, onClose, onSubmit, editItem }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editItem) {
      setForm({
        title: editItem.title,
        amount: editItem.amount,
        transaction_type: editItem.transaction_type,
        category: editItem.category,
        note: editItem.note || "",
      });
    } else {
      setForm(EMPTY);
    }
    setError("");
  }, [editItem, isOpen]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Title is required");
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      return setError("Enter a valid amount");
    setLoading(true);
    setError("");
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedCat = CATEGORIES.find((c) => c.name === form.category);

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.sheet} className="animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div style={s.handle} />

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={{
              ...s.headerIcon,
              background: form.transaction_type === "income" ? "#10d9a020" : "#f43f5e20",
              color: form.transaction_type === "income" ? "var(--green)" : "var(--red)",
            }}>
              {form.transaction_type === "income" ? "↑" : "↓"}
            </div>
            <div>
              <div style={s.headerTitle}>{editItem ? "Edit Transaction" : "New Transaction"}</div>
              <div style={s.headerSub}>Fill in the details below</div>
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Type Toggle */}
        <div style={s.typeToggle}>
          {["expense", "income"].map((type) => (
            <button
              key={type}
              style={{
                ...s.typeBtn,
                ...(form.transaction_type === type
                  ? {
                      ...s.typeBtnActive,
                      background: type === "income" ? "#10d9a015" : "#f43f5e15",
                      border: `1px solid ${type === "income" ? "#10d9a040" : "#f43f5e40"}`,
                      color: type === "income" ? "var(--green)" : "var(--red)",
                    }
                  : {}),
              }}
              onClick={() => set("transaction_type", type)}
            >
              <span>{type === "income" ? "↑" : "↓"}</span>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={s.form}>
          <Field label="Title">
            <input
              style={s.input}
              placeholder="e.g. Monthly Salary, Netflix..."
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          <Field label="Amount (₹)">
            <div style={s.amountWrap}>
              <span style={s.currencyPrefix}>₹</span>
              <input
                style={{ ...s.input, paddingLeft: 32 }}
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
          </Field>

          <Field label="Category">
            <div style={s.catGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  style={{
                    ...s.catBtn,
                    ...(form.category === cat.name
                      ? { background: `${cat.color}20`, border: `1px solid ${cat.color}50`, color: cat.color }
                      : {}),
                  }}
                  onClick={() => set("category", cat.name)}
                  title={cat.name}
                >
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={s.catLabel}>{cat.name}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Note (optional)">
            <textarea
              style={s.textarea}
              placeholder="Add a note..."
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              rows={2}
            />
          </Field>

          {error && <div style={s.error}>{error}</div>}

          <button
            style={{
              ...s.submitBtn,
              background: form.transaction_type === "income"
                ? "linear-gradient(135deg, #10d9a0, #059669)"
                : "linear-gradient(135deg, #f43f5e, #e11d48)",
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : editItem ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        color: "var(--text3)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 200,
  },
  sheet: {
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: "24px 24px 0 0",
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "8px 24px 40px",
  },
  handle: {
    width: 40,
    height: 4,
    background: "var(--border2)",
    borderRadius: 99,
    margin: "12px auto 20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
  },
  headerTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 700,
  },
  headerSub: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text3)",
    marginTop: 2,
  },
  closeBtn: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text3)",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },
  typeToggle: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 20,
  },
  typeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "11px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text2)",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.18s",
  },
  typeBtnActive: {},
  form: { display: "flex", flexDirection: "column", gap: 18 },
  input: {
    width: "100%",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text)",
    fontSize: 14,
    padding: "11px 14px",
    transition: "border-color 0.2s",
  },
  amountWrap: { position: "relative" },
  currencyPrefix: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text2)",
    fontSize: 14,
    fontWeight: 600,
    pointerEvents: "none",
  },
  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  catBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    padding: "10px 6px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text2)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  catLabel: {
    fontSize: 9,
    fontFamily: "var(--font-mono)",
    letterSpacing: "0.03em",
  },
  textarea: {
    width: "100%",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text)",
    fontSize: 13,
    padding: "11px 14px",
    resize: "vertical",
    fontFamily: "var(--font-display)",
    transition: "border-color 0.2s",
  },
  error: {
    background: "#f43f5e15",
    border: "1px solid #f43f5e30",
    borderRadius: 8,
    color: "var(--red)",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    padding: "10px 14px",
  },
  submitBtn: {
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    padding: "14px",
    cursor: "pointer",
    transition: "opacity 0.2s",
    letterSpacing: "-0.3px",
    marginTop: 4,
  },
};