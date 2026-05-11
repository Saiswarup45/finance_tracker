import { formatCurrency } from "../utils/helpers";

export default function SummaryCards({ balance, income, expense, monthlyIncome, monthlyExpense }) {
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const cards = [
    {
      label: "Net Balance",
      value: formatCurrency(balance),
      valueColor: balance >= 0 ? "var(--green)" : "var(--red)",
      sub: balance >= 0 ? "You're in the green" : "Spending exceeds income",
      subColor: balance >= 0 ? "var(--green)" : "var(--red)",
      icon: "◈",
      accent: balance >= 0 ? "#10d9a0" : "#f43f5e",
      wide: true,
    },
    {
      label: "Total Income",
      value: formatCurrency(income),
      valueColor: "var(--green)",
      sub: `This month: ${formatCurrency(monthlyIncome)}`,
      icon: "↑",
      accent: "#10d9a0",
    },
    {
      label: "Total Expense",
      value: formatCurrency(expense),
      valueColor: "var(--red)",
      sub: `This month: ${formatCurrency(monthlyExpense)}`,
      icon: "↓",
      accent: "#f43f5e",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      valueColor: savingsRate >= 20 ? "var(--green)" : savingsRate >= 10 ? "var(--yellow)" : "var(--red)",
      sub: savingsRate >= 20 ? "Excellent!" : savingsRate >= 10 ? "Could be better" : "Needs attention",
      icon: "◉",
      accent: "#6366f1",
    },
  ];

  return (
    <div style={s.grid}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`animate-fade-up delay-${i + 1}`}
          style={{
            ...s.card,
            ...(card.wide ? s.cardWide : {}),
            "--card-accent": card.accent,
          }}
        >
          <div style={s.cardTop}>
            <span style={s.cardLabel}>{card.label}</span>
            <span style={{ ...s.cardIcon, color: card.accent }}>{card.icon}</span>
          </div>
          <div style={{ ...s.cardValue, color: card.valueColor }}>{card.value}</div>
          <div style={{ ...s.cardSub, color: card.subColor || "var(--text2)" }}>{card.sub}</div>
          <div style={{ ...s.cardGlow, background: card.accent }} />
        </div>
      ))}
    </div>
  );
}

const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: 12,
    padding: "24px 24px 0",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "20px 22px",
    transition: "border-color 0.2s, transform 0.2s",
  },
  cardWide: {
    background: "linear-gradient(135deg, #0d0e1a 0%, #111228 100%)",
    border: "1px solid #252640",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text2)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  cardIcon: {
    fontSize: 18,
    fontWeight: 700,
  },
  cardValue: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "-1px",
    lineHeight: 1,
    marginBottom: 8,
  },
  cardSub: {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    letterSpacing: "0.05em",
  },
  cardGlow: {
    position: "absolute",
    bottom: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: "50%",
    opacity: 0.06,
    filter: "blur(20px)",
  },
};