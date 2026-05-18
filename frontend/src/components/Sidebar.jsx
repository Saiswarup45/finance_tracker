import { fmt } from "../utils/helpers";

const NAV = [
  { id:"dashboard",    icon:"◈", label:"Dashboard"    },
  { id:"transactions", icon:"⇄", label:"Transactions" },
  { id:"budgets",      icon:"◎", label:"Budgets"      },
  { id:"goals",        icon:"◉", label:"Goals"        },
  { id:"analytics",   icon:"∿", label:"Analytics"    },
];

export default function Sidebar({ page, setPage, balance, theme, toggleTheme, isMobile, open, onClose }) {
  const isPos = balance >= 0;

  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Nav */}
        <nav style={mbs.nav}>
          {NAV.map(n => (
            <button
              key={n.id}
              style={{ ...mbs.btn, ...(page===n.id ? mbs.btnActive : {}) }}
              onClick={() => setPage(n.id)}
            >
              <span style={mbs.icon}>{n.icon}</span>
              <span style={mbs.label}>{n.label.slice(0,4)}</span>
            </button>
          ))}
        </nav>
      </>
    );
  }

  return (
    <aside style={s.aside}>
      {/* Brand */}
      <div style={s.brand}>
        <div style={s.logo}>
          <span style={s.logoSymbol}>₹</span>
          <div style={s.logoPulse} />
        </div>
        <div>
          <div style={s.logoName}>FinTrack</div>
          <div style={s.logoTag}>Personal Finance</div>
        </div>
      </div>

      {/* Balance pill */}
      <div style={{ ...s.balancePill, borderColor: isPos ? "var(--teal3)" : "var(--red)", background: isPos ? "rgba(45,212,191,0.06)" : "rgba(248,113,113,0.06)" }}>
        <div style={s.balLabel}>Net Balance</div>
        <div style={{ ...s.balValue, color: isPos ? "var(--teal)" : "var(--red)" }}>{fmt(balance)}</div>
      </div>

      {/* Nav */}
      <nav style={s.nav}>
        {NAV.map((n, i) => (
          <button
            key={n.id}
            className={page===n.id ? "" : "au"}
            style={{ ...s.navBtn, ...(page===n.id ? s.navActive : {}), animationDelay:`${i*0.04}s` }}
            onClick={() => setPage(n.id)}
          >
            <span style={{ ...s.navIcon, color: page===n.id ? "var(--teal)" : "var(--text3)" }}>{n.icon}</span>
            <span style={s.navLabel}>{n.label}</span>
            {page===n.id && <span style={s.activeBar} />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={s.footer}>
        <button style={s.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {theme==="dark" ? "☀ Light" : "◑ Dark"}
        </button>
        <div style={s.version}>v2.0</div>
      </div>
    </aside>
  );
}

const s = {
  aside: {
    width: "var(--sw)",
    minWidth: "var(--sw)",
    height: "100vh",
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    background: "var(--bg2)",
    borderRight: "1px solid var(--border)",
    padding: "20px 12px",
    gap: 8,
    flexShrink: 0,
    overflow: "hidden",
  },
  brand: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "4px 8px 16px",
    borderBottom: "1px solid var(--border)",
    marginBottom: 8,
  },
  logo: {
    position: "relative",
    width: 36, height: 36,
    background: "linear-gradient(135deg,var(--teal3),var(--teal))",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(45,212,191,0.3)",
  },
  logoPulse: {
    position: "absolute", inset: -3, borderRadius: 13,
    border: "1px solid rgba(45,212,191,0.2)",
    animation: "glow 2.5s ease-in-out infinite",
  },
  logoSymbol: { fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "var(--font-d)" },
  logoName: { fontFamily: "var(--font-d)", fontSize: 15, fontWeight: 700, color: "var(--text)" },
  logoTag: { fontFamily: "var(--font-m)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.12em", marginTop: 1 },
  balancePill: {
    margin: "0 4px 8px",
    border: "1px solid",
    borderRadius: "var(--r)",
    padding: "10px 14px",
  },
  balLabel: { fontFamily: "var(--font-m)", fontSize: 9, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 },
  balValue: { fontFamily: "var(--font-d)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" },
  nav: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  navBtn: {
    position: "relative",
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px",
    background: "transparent",
    border: "none",
    borderRadius: "var(--r2)",
    color: "var(--text2)",
    fontSize: 13, fontWeight: 500,
    transition: "all 0.18s ease",
    textAlign: "left",
  },
  navActive: { background: "var(--bg4)", color: "var(--text)" },
  navIcon: { fontSize: 15, width: 20, textAlign: "center", transition: "color 0.18s" },
  navLabel: { fontFamily: "var(--font-b)" },
  activeBar: {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    width: 4, height: 4, borderRadius: "50%",
    background: "var(--teal)",
    boxShadow: "0 0 8px var(--teal)",
  },
  footer: {
    paddingTop: 12, borderTop: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  themeBtn: {
    background: "var(--bg3)", border: "1px solid var(--border2)",
    borderRadius: "var(--r2)", color: "var(--text2)",
    fontFamily: "var(--font-m)", fontSize: 10,
    padding: "6px 12px", letterSpacing: "0.05em",
    transition: "all 0.15s",
  },
  version: { fontFamily: "var(--font-m)", fontSize: 9, color: "var(--text4)" },
};

const mbs = {
  nav: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    zIndex: 100,
    display: "flex",
    background: "var(--bg2)",
    borderTop: "1px solid var(--border2)",
    padding: "6px 0 10px",
  },
  btn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    background: "transparent", border: "none", color: "var(--text3)",
    padding: "6px 4px", transition: "color 0.15s",
  },
  btnActive: { color: "var(--teal)" },
  icon: { fontSize: 17 },
  label: { fontFamily: "var(--font-m)", fontSize: 9, letterSpacing: "0.06em" },
};