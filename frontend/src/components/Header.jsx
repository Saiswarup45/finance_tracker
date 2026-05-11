export default function Header({ activePage, setActivePage }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⬡" },
    { id: "transactions", label: "Transactions", icon: "⇄" },
    { id: "budgets", label: "Budgets", icon: "◎" },
    { id: "analytics", label: "Analytics", icon: "∿" },
  ];

  return (
    <header style={s.header}>
      <div style={s.brand}>
        <div style={s.logoBox}>
          <span style={s.logoSymbol}>₹</span>
        </div>
        <div>
          <div style={s.logoName}>FinTrack</div>
          <div style={s.logoTag}>Smart Money</div>
        </div>
      </div>

      <nav style={s.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...s.navBtn,
              ...(activePage === item.id ? s.navBtnActive : {}),
            }}
            onClick={() => setActivePage(item.id)}
          >
            <span style={s.navIcon}>{item.icon}</span>
            <span style={s.navLabel}>{item.label}</span>
            {activePage === item.id && <span style={s.navIndicator} />}
          </button>
        ))}
      </nav>
    </header>
  );
}

const s = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(7,8,15,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid #1c1d2e",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 38,
    height: 38,
    background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
  },
  logoSymbol: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    fontFamily: "var(--font-display)",
  },
  logoName: {
    fontFamily: "var(--font-display)",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#e2e4f0",
  },
  logoTag: {
    fontSize: 9,
    color: "#3a3b52",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "var(--font-mono)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  navBtn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    background: "transparent",
    border: "none",
    borderRadius: 8,
    color: "#6b6d8a",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.18s ease",
    cursor: "pointer",
  },
  navBtnActive: {
    color: "#e2e4f0",
    background: "#1c1d2e",
  },
  navIcon: {
    fontSize: 14,
  },
  navLabel: {
    fontFamily: "var(--font-display)",
  },
  navIndicator: {
    position: "absolute",
    bottom: -1,
    left: "50%",
    transform: "translateX(-50%)",
    width: 16,
    height: 2,
    background: "#6366f1",
    borderRadius: 99,
  },
};