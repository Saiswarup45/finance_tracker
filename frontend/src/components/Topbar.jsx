export default function Topbar({ page, theme, toggleTheme, onAdd }) {
  const titles = {
    dashboard:"Dashboard", transactions:"Transactions",
    budgets:"Budgets", goals:"Goals", analytics:"Analytics",
  };
  return (
    <header style={s.bar}>
      <div style={s.left}>
        <div style={s.logo}>₹</div>
        <span style={s.title}>{titles[page]}</span>
      </div>
      <div style={s.right}>
        <button style={s.iconBtn} onClick={toggleTheme}>{theme==="dark"?"☀":"◑"}</button>
        <button style={s.addBtn} onClick={onAdd}>+</button>
      </div>
    </header>
  );
}

const s = {
  bar: {
    position: "sticky", top: 0, zIndex: 80,
    height: "var(--hh)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 16px",
    background: "rgba(9,13,12,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
  },
  left: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 32, height: 32,
    background: "linear-gradient(135deg,var(--teal3),var(--teal))",
    borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "var(--font-d)",
  },
  title: { fontFamily: "var(--font-d)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" },
  right: { display: "flex", alignItems: "center", gap: 8 },
  iconBtn: {
    background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8,
    color: "var(--text2)", fontSize: 14, width: 34, height: 34,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  addBtn: {
    background: "linear-gradient(135deg,var(--teal3),var(--teal))",
    border: "none", borderRadius: 8,
    color: "#fff", fontSize: 20, fontWeight: 300,
    width: 34, height: 34,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 14px rgba(45,212,191,0.35)",
  },
};