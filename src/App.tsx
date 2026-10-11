/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Header } from './components/layout/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { ConfirmModal } from './components/common/ConfirmModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { DecisionSimulatorView } from './components/simulator/DecisionSimulatorView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetPlannerView } from './components/budget/BudgetPlannerView';
import { SavingsGoalsView } from './components/savings/SavingsGoalsView';
import { CommitmentsView } from './components/commitments/CommitmentsView';
import { InsightsForecastView } from './components/insights/InsightsForecastView';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);

  const { resetDemoData } = useFinance();

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col lg:flex-row antialiased selection:bg-[#B8F36B] selection:text-[#101827]">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRequestReset={() => setIsResetModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenSimulator={() => setActiveTab('simulator')}
          onRequestReset={() => setIsResetModalOpen(true)}
        />

        {/* View Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateToTab={setActiveTab}
              onOpenAddTransactionModal={() => setIsQuickAddModalOpen(true)}
            />
          )}

          {activeTab === 'simulator' && <DecisionSimulatorView />}

          {activeTab === 'transactions' && (
            <TransactionsView
              isAddModalOpen={isQuickAddModalOpen}
              onCloseAddModal={() => setIsQuickAddModalOpen(false)}
            />
          )}

          {activeTab === 'budget' && <BudgetPlannerView />}

          {activeTab === 'savings' && <SavingsGoalsView />}

          {activeTab === 'commitments' && <CommitmentsView />}

          {activeTab === 'insights' && <InsightsForecastView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Global Notification Toasts */}
      <NotificationToast />

      {/* Reset Demo Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Demo Data?"
        message="This will restore all transactions, budgets, savings goals, and commitments back to the original Gen Z ₹10,000 / 30-day baseline (₹7,200 balance, ₹2,800 expenses, ₹1,200 unpaid bills, 18 days remaining)."
        confirmLabel="Reset to Baseline"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
