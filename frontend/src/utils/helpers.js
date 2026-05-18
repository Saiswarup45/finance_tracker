export const CATEGORIES = [
  { name:"Food",          icon:"🍜", color:"#f97316" },
  { name:"Transport",     icon:"🚇", color:"#38bdf8" },
  { name:"Shopping",      icon:"🛍️", color:"#f472b6" },
  { name:"Health",        icon:"💊", color:"#34d399" },
  { name:"Entertainment", icon:"🎬", color:"#a78bfa" },
  { name:"Utilities",     icon:"⚡", color:"#fbbf24" },
  { name:"Rent",          icon:"🏠", color:"#2dd4bf" },
  { name:"Education",     icon:"📚", color:"#60a5fa" },
  { name:"Dining",        icon:"🍽️", color:"#fb923c" },
  { name:"Salary",        icon:"💼", color:"#4ade80" },
  { name:"Freelance",     icon:"💻", color:"#67e8f9" },
  { name:"Investment",    icon:"📈", color:"#86efac" },
  { name:"Gift",          icon:"🎁", color:"#f9a8d4" },
  { name:"Other",         icon:"📦", color:"#94a3b8" },
];

export const INCOME_CATS  = ["Salary","Freelance","Investment","Gift","Other"];
export const EXPENSE_CATS = CATEGORIES.filter(c=>!["Salary","Freelance","Investment"].includes(c.name));

export const getCat = (name) => CATEGORIES.find(c=>c.name===name) || CATEGORIES[CATEGORIES.length-1];

export const fmt = (n) =>
  new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

export const fmtCompact = (n) => {
  if(Math.abs(n)>=100000) return `₹${(n/100000).toFixed(1)}L`;
  if(Math.abs(n)>=1000)   return `₹${(n/1000).toFixed(1)}K`;
  return fmt(n);
};

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

export const fmtDateShort = (d) =>
  new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short"});

export const fmtMonth = (d) =>
  new Date(d).toLocaleDateString("en-IN",{month:"short",year:"2-digit"});

export const monthLabel = (idx) =>
  new Date(2000,idx).toLocaleString("en-IN",{month:"short"});

export const groupByMonth = (txns) => {
  const map={};
  [...txns].sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(t=>{
    const d=new Date(t.date);
    const k=`${d.getFullYear()}-${d.getMonth()}`;
    if(!map[k]) map[k]={label:monthLabel(d.getMonth()),income:0,expense:0,month:d.getMonth(),year:d.getFullYear()};
    if(t.transaction_type==="income") map[k].income+=parseFloat(t.amount);
    else map[k].expense+=parseFloat(t.amount);
  });
  return Object.values(map).slice(-7);
};

export const groupByCat = (txns,type="expense") => {
  const map={};
  txns.filter(t=>t.transaction_type===type).forEach(t=>{
    map[t.category]=(map[t.category]||0)+parseFloat(t.amount);
  });
  return Object.entries(map)
    .map(([name,amount])=>({name,amount,cat:getCat(name)}))
    .sort((a,b)=>b.amount-a.amount);
};

export const getDayOfWeek = (txns) => {
  const days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const map={};
  days.forEach(d=>{map[d]={income:0,expense:0}});
  txns.forEach(t=>{
    const d=days[new Date(t.date).getDay()];
    if(t.transaction_type==="income") map[d].income+=parseFloat(t.amount);
    else map[d].expense+=parseFloat(t.amount);
  });
  return days.map(d=>({day:d,...map[d]}));
};

export const MONTHS = Array.from({length:12},(_,i)=>
  new Date(2000,i).toLocaleString("en-IN",{month:"long"})
);

export const todayStr = () => new Date().toISOString().split("T")[0];
export const thisMonth = () => new Date().getMonth()+1;
export const thisYear  = () => new Date().getFullYear();