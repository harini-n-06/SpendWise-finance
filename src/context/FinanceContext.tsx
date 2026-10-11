import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  FinanceState,
  Transaction,
  SavingsGoal,
  Commitment,
  SimulationParams,
  FinancialHealthScore,
} from '../types/finance';
import { INITIAL_FINANCE_STATE } from '../data/initialData';
import {
  calculateBalance,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateUnpaidCommitments,
  calculateSavingsSummary,
  calculateDaysRemaining,
  calculateSafeDailyAllowance,
  calculateMonthEndForecast,
  calculateFinancialHealthScore,
  calculateCategorySpending,
} from '../utils/calculations';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface FinanceContextType {
  state: FinanceState;
  metrics: {
    balance: number;
    totalExpenses: number;
    totalIncome: number;
    unpaidCommitments: number;
    daysRemaining: number;
    safeDailyAllowance: number;
    savingsSummary: ReturnType<typeof calculateSavingsSummary>;
    forecast: ReturnType<typeof calculateMonthEndForecast>;
    healthScore: FinancialHealthScore;
    categorySpending: ReturnType<typeof calculateCategorySpending>;
  };
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'dayOfCycle'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  updateCategoryBudget: (categoryId: string, allocatedAmount: number) => void;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  withdrawFromGoal: (goalId: string, amount: number) => void;

  addCommitment: (com: Omit<Commitment, 'id' | 'isPaid'>) => void;
  updateCommitment: (id: string, updates: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;
  markCommitmentPaid: (commitmentId: string) => void;

  applySimulatedDecision: (params: SimulationParams) => void;
  resetDemoData: () => void;
  setCycleDay: (day: number) => void;
}

const STORAGE_KEY = 'spendwise_finance_state_v1';

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings && parsed.transactions && parsed.commitments) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_FINANCE_STATE;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save finance state to localStorage', e);
    }
  }, [state]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Central metrics derived memo
  const metrics = useMemo(() => {
    const balance = calculateBalance(state);
    const totalExpenses = calculateTotalExpenses(state.transactions);
    const totalIncome = calculateTotalIncome(state.transactions);
    const unpaidCommitments = calculateUnpaidCommitments(state);
    const daysRemaining = calculateDaysRemaining(state);
    const safeDailyAllowance = calculateSafeDailyAllowance(state);
    const savingsSummary = calculateSavingsSummary(state);
    const forecast = calculateMonthEndForecast(state);
    const healthScore = calculateFinancialHealthScore(state);
    const categorySpending = calculateCategorySpending(state);

    return {
      balance,
      totalExpenses,
      totalIncome,
      unpaidCommitments,
      daysRemaining,
      safeDailyAllowance,
      savingsSummary,
      forecast,
      healthScore,
      categorySpending,
    };
  }, [state]);

  // Action: Add Transaction
  const addTransaction = (tx: Omit<Transaction, 'id' | 'dayOfCycle'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now(),
      dayOfCycle: state.settings.currentDay,
    };
    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
    showToast(`Recorded ${tx.type === 'expense' ? 'expense' : 'income'} of ₹${tx.amount.toLocaleString('en-IN')}`);
  };

  // Action: Update Transaction
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    showToast('Transaction updated');
  };

  // Action: Delete Transaction
  const deleteTransaction = (id: string) => {
    setState((prev) => {
      const target = prev.transactions.find((t) => t.id === id);
      const newTransactions = prev.transactions.filter((t) => t.id !== id);
      
      // If this transaction was attached to a paid commitment, restore commitment to unpaid
      let newCommitments = prev.commitments;
      if (target?.commitmentId) {
        newCommitments = prev.commitments.map((c) =>
          c.id === target.commitmentId ? { ...c, isPaid: false, paidTransactionId: undefined } : c
        );
      }

      return {
        ...prev,
        transactions: newTransactions,
        commitments: newCommitments,
      };
    });
    showToast('Transaction removed', 'info');
  };

  // Action: Update Category Budget
  const updateCategoryBudget = (categoryId: string, allocatedAmount: number) => {
    setState((prev) => ({
      ...prev,
      budgetCategories: prev.budgetCategories.map((bc) =>
        bc.id === categoryId ? { ...bc, allocatedAmount: Math.max(0, allocatedAmount) } : bc
      ),
    }));
    showToast('Category budget updated');
  };

  // Action: Add Savings Goal
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'savedAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'goal_' + Date.now(),
      savedAmount: 0,
    };
    setState((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal],
    }));
    showToast(`Created savings goal "${goal.title}"`);
  };

  // Action: Update Savings Goal
  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
    showToast('Savings goal updated');
  };

  // Action: Delete Savings Goal
  const deleteSavingsGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
    showToast('Savings goal removed', 'info');
  };

  // Action: Contribute to Goal
  const contributeToGoal = (goalId: string, amount: number) => {
    const validAmount = Math.max(0, amount);
    if (validAmount <= 0) return;

    setState((prev) => {
      const goal = prev.savingsGoals.find((g) => g.id === goalId);
      if (!goal) return prev;

      // Creates a transaction for savings deposit
      const saveTx: Transaction = {
        id: 'tx_save_' + Date.now(),
        title: `Saved: ${goal.title}`,
        amount: validAmount,
        type: 'expense',
        category: 'Savings Transfer',
        date: new Date().toISOString().split('T')[0],
        dayOfCycle: prev.settings.currentDay,
        notes: `Allocated into ${goal.title}`,
      };

      const updatedGoals = prev.savingsGoals.map((g) =>
        g.id === goalId ? { ...g, savedAmount: g.savedAmount + validAmount } : g
      );

      return {
        ...prev,
        transactions: [saveTx, ...prev.transactions],
        savingsGoals: updatedGoals,
      };
    });
    showToast(`Deposited ₹${validAmount.toLocaleString('en-IN')} toward savings goal!`);
  };

  // Action: Withdraw from Goal
  const withdrawFromGoal = (goalId: string, amount: number) => {
    const validAmount = Math.max(0, amount);
    if (validAmount <= 0) return;

    setState((prev) => {
      const goal = prev.savingsGoals.find((g) => g.id === goalId);
      if (!goal || goal.savedAmount < validAmount) return prev;

      const withdrawTx: Transaction = {
        id: 'tx_withdraw_' + Date.now(),
        title: `Withdrawn from ${goal.title}`,
        amount: validAmount,
        type: 'income',
        category: 'Savings Transfer',
        date: new Date().toISOString().split('T')[0],
        dayOfCycle: prev.settings.currentDay,
        notes: `Returned to active balance from ${goal.title}`,
      };

      const updatedGoals = prev.savingsGoals.map((g) =>
        g.id === goalId ? { ...g, savedAmount: Math.max(0, g.savedAmount - validAmount) } : g
      );

      return {
        ...prev,
        transactions: [withdrawTx, ...prev.transactions],
        savingsGoals: updatedGoals,
      };
    });
    showToast(`Transferred ₹${validAmount.toLocaleString('en-IN')} back to balance`);
  };

  // Action: Add Commitment
  const addCommitment = (com: Omit<Commitment, 'id' | 'isPaid'>) => {
    const newCom: Commitment = {
      ...com,
      id: 'com_' + Date.now(),
      isPaid: false,
    };
    setState((prev) => ({
      ...prev,
      commitments: [...prev.commitments, newCom],
    }));
    showToast(`Added upcoming commitment "${com.title}"`);
  };

  // Action: Update Commitment
  const updateCommitment = (id: string, updates: Partial<Commitment>) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    showToast('Commitment updated');
  };

  // Action: Delete Commitment
  const deleteCommitment = (id: string) => {
    setState((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
    showToast('Commitment removed', 'info');
  };

  // Action: Mark Commitment Paid (No double-counting)
  const markCommitmentPaid = (commitmentId: string) => {
    setState((prev) => {
      const commitment = prev.commitments.find((c) => c.id === commitmentId);
      if (!commitment || commitment.isPaid) return prev;

      // 1. Create matching expense transaction
      const txId = 'tx_bill_' + Date.now();
      const billTx: Transaction = {
        id: txId,
        title: `Paid Bill: ${commitment.title}`,
        amount: commitment.amount,
        type: 'expense',
        category: commitment.category,
        date: new Date().toISOString().split('T')[0],
        dayOfCycle: prev.settings.currentDay,
        commitmentId: commitment.id,
        notes: `Paid on Day ${prev.settings.currentDay} (${commitment.frequency})`,
      };

      // 2. Mark commitment paid and link transaction
      const updatedCommitments = prev.commitments.map((c) =>
        c.id === commitmentId ? { ...c, isPaid: true, paidTransactionId: txId } : c
      );

      return {
        ...prev,
        transactions: [billTx, ...prev.transactions],
        commitments: updatedCommitments,
      };
    });
    showToast('Bill marked as paid & expense recorded without double-counting');
  };

  // Action: Confirm & Apply Simulated Decision
  const applySimulatedDecision = (params: SimulationParams) => {
    const amount = Math.max(0, params.amount);
    if (amount <= 0 && params.type !== 'cancel_commitment') return;

    if (params.type === 'purchase' || params.type === 'unexpected_bill') {
      addTransaction({
        title: params.title || (params.type === 'purchase' ? 'Simulated Purchase' : 'Unexpected Expense'),
        amount,
        type: 'expense',
        category: params.category,
        date: new Date().toISOString().split('T')[0],
        notes: params.notes || 'Applied from Decision Simulator',
      });
    } else if (params.type === 'income') {
      addTransaction({
        title: params.title || 'Additional Income',
        amount,
        type: 'income',
        category: 'Freelance / Income',
        date: new Date().toISOString().split('T')[0],
        notes: params.notes || 'Applied from Decision Simulator',
      });
    } else if (params.type === 'subscription') {
      addCommitment({
        title: params.title || 'New Subscription',
        amount,
        category: params.category,
        frequency: 'monthly',
        dueDate: new Date().toISOString().split('T')[0],
        dueDayOfCycle: Math.min(30, state.settings.currentDay + 7),
        isAutoPay: true,
      });
    } else if (params.type === 'savings_deposit') {
      if (params.targetGoalId) {
        contributeToGoal(params.targetGoalId, amount);
      } else if (state.savingsGoals.length > 0) {
        contributeToGoal(state.savingsGoals[0].id, amount);
      }
    } else if (params.type === 'cancel_commitment') {
      // Find matching commitment and remove
      const match = state.commitments.find((c) => c.title.toLowerCase().includes(params.title.toLowerCase()));
      if (match) {
        deleteCommitment(match.id);
      }
    }

    showToast(`Applied decision "${params.title || params.type}" to your active budget!`);
  };

  // Action: Reset Demo Data
  const resetDemoData = () => {
    setState(INITIAL_FINANCE_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Reset to original Gen Z ₹10,000 / 30-day demo state', 'info');
  };

  // Action: Set current day in cycle
  const setCycleDay = (day: number) => {
    const clampedDay = Math.min(30, Math.max(1, day));
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        currentDay: clampedDay,
      },
    }));
    showToast(`Timeline adjusted to Day ${clampedDay} of 30`);
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        metrics,
        toasts,
        showToast,
        removeToast,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateCategoryBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        contributeToGoal,
        withdrawFromGoal,
        addCommitment,
        updateCommitment,
        deleteCommitment,
        markCommitmentPaid,
        applySimulatedDecision,
        resetDemoData,
        setCycleDay,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
