import { useState } from "react";
import "./styles/global.css";

import { useTransactions } from "./hooks/UseTransactions";

import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import TransactionModal from "./components/TransactionModal";
import Budgets from "./components/Budgets";
import Charts from "./components/Charts";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const {
    transactions, budgets, loading, error,
    income, expense, balance,
    monthlyIncome, monthlyExpense, lastMonthExpense,
    savingsRate, thisMonthTxns,
    addTransaction, updateTransaction, deleteTransaction,
    addBudget, deleteBudget,
  } = useTransactions();

  const openAddModal = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditItem(t);
    setModalOpen(true);
  };

  const handleModalSubmit = async (form) => {
    if (editItem) {
      await updateTransaction(editItem.id, form);
    } else {
      await addTransaction(form);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="noise" style={s.app}>
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main style={s.main}>
        {/* Loading */}
        {loading && (
          <div style={s.loadingWrap}>
            <div style={s.loader} />
            <span style={s.loadingText}>Loading your finances...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={s.errorBanner}>
            <span>⚠ Could not connect to backend: {error}</span>
            <span style={s.errorHint}>Make sure Django is running on port 8000</span>
          </div>
        )}

        {/* Pages */}
        {!loading && !error && (
          <>
            {activePage === "dashboard" && (
              <Dashboard
                transactions={transactions}
                balance={balance}
                income={income}
                expense={expense}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                lastMonthExpense={lastMonthExpense}
                savingsRate={savingsRate}
                thisMonthTxns={thisMonthTxns}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onAddClick={openAddModal}
              />
            )}

            {activePage === "transactions" && (
              <TransactionList
                transactions={transactions}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onAdd={openAddModal}
              />
            )}

            {activePage === "budgets" && (
              <Budgets
                budgets={budgets}
                transactions={transactions}
                onAdd={addBudget}
                onDelete={deleteBudget}
              />
            )}

            {activePage === "analytics" && (
              <div style={s.analyticsWrap}>
                <div style={s.analyticsHeader}>
                  <div style={s.pageTitle}>Analytics</div>
                  <div style={s.pageSub}>Visual breakdown of your financial data</div>
                </div>
                <Charts transactions={transactions} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Add Button */}
      {!loading && !error && (
        <button style={s.fab} onClick={openAddModal} title="Add transaction">
          +
        </button>
      )}

      {/* Modal */}
      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onSubmit={handleModalSubmit}
        editItem={editItem}
      />
    </div>
  );
}

const s = {
  app: {
    minHeight: "100vh",
    background: "var(--bg)",
  },
  main: {
    paddingBottom: 80,
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: "100px 24px",
  },
  loader: {
    width: 36,
    height: 36,
    border: "3px solid var(--border2)",
    borderTop: "3px solid var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "var(--text3)",
    letterSpacing: "0.08em",
  },
  errorBanner: {
    margin: "24px",
    background: "#f43f5e10",
    border: "1px solid #f43f5e30",
    borderRadius: 12,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "var(--red)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
  },
  errorHint: {
    color: "var(--text3)",
    fontSize: 11,
  },
  fab: {
    position: "fixed",
    bottom: 28,
    right: 28,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #818cf8)",
    border: "none",
    color: "#fff",
    fontSize: 26,
    fontWeight: 300,
    boxShadow: "0 0 30px rgba(99,102,241,0.5), 0 4px 20px rgba(0,0,0,0.4)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    animation: "pulse-glow 3s ease-in-out infinite",
    zIndex: 100,
  },
  analyticsWrap: { padding: "20px 24px 0" },
  analyticsHeader: { marginBottom: 4 },
  pageTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },
  pageSub: {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--text3)",
    marginTop: 4,
  },
};