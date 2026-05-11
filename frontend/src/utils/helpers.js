export const CATEGORIES = [
  { name: "Food", icon: "🍜", color: "#f97316" },
  { name: "Transport", icon: "🚇", color: "#3b82f6" },
  { name: "Shopping", icon: "🛍️", color: "#ec4899" },
  { name: "Health", icon: "💊", color: "#22c55e" },
  { name: "Entertainment", icon: "🎬", color: "#a855f7" },
  { name: "Utilities", icon: "⚡", color: "#eab308" },
  { name: "Rent", icon: "🏠", color: "#14b8a6" },
  { name: "Salary", icon: "💼", color: "#00ffaa" },
  { name: "Freelance", icon: "💻", color: "#38bdf8" },
  { name: "Investment", icon: "📈", color: "#4ade80" },
  { name: "Other", icon: "📦", color: "#94a3b8" },
];

export const getCategoryMeta = (name) =>
  CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateShort = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

export const getMonthName = (monthIndex) =>
  new Date(2000, monthIndex).toLocaleString("en-IN", { month: "short" });

export const groupByMonth = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) map[key] = { label: getMonthName(d.getMonth()), income: 0, expense: 0 };
    if (t.transaction_type === "income") map[key].income += parseFloat(t.amount);
    else map[key].expense += parseFloat(t.amount);
  });
  return Object.values(map).slice(-6);
};

export const groupByCategory = (transactions, type = "expense") => {
  const map = {};
  transactions
    .filter((t) => t.transaction_type === type)
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + parseFloat(t.amount);
    });
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount, meta: getCategoryMeta(name) }))
    .sort((a, b) => b.amount - a.amount);
};

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];