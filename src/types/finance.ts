export type TransactionType = 'expense' | 'income';

export type Category = 
  | 'Food & Dining'
  | 'Groceries'
  | 'Commute & Transit'
  | 'Entertainment'
  | 'Shopping & Style'
  | 'Health & Fitness'
  | 'Utilities & Bills'
  | 'Education & Books'
  | 'Savings Transfer'
  | 'Freelance / Income'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // YYYY-MM-DD
  dayOfCycle: number; // 1 - 30
  notes?: string;
  commitmentId?: string; // If auto-generated from paid commitment
}

export interface BudgetCategory {
  id: string;
  category: Category;
  allocatedAmount: number;
  iconName?: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  notes?: string;
}

export type CommitmentFrequency = 'monthly' | 'one-time';

export interface Commitment {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  dueDayOfCycle: number; // 1 - 30
  category: Category;
  frequency: CommitmentFrequency;
  isPaid: boolean;
  paidTransactionId?: string;
  isAutoPay?: boolean;
}

export type SimulationType = 
  | 'purchase' 
  | 'unexpected_bill' 
  | 'subscription' 
  | 'income' 
  | 'savings_deposit'
  | 'cancel_commitment';

export interface SimulationParams {
  type: SimulationType;
  title: string;
  amount: number;
  category: Category;
  frequency?: CommitmentFrequency;
  notes?: string;
  targetGoalId?: string;
}

export interface SimulationResult {
  currentBalance: number;
  simulatedBalance: number;
  balanceDelta: number;
  
  currentSafeDailyAllowance: number;
  simulatedSafeDailyAllowance: number;
  safeDailyDelta: number;
  
  currentMonthEndForecast: number;
  simulatedMonthEndForecast: number;
  forecastDelta: number;

  currentHealthScore: number;
  simulatedHealthScore: number;
  healthScoreDelta: number;

  currentRiskLevel: 'Stable' | 'Caution' | 'High Risk';
  simulatedRiskLevel: 'Stable' | 'Caution' | 'High Risk';

  verdict: {
    status: 'safe' | 'caution' | 'critical' | 'beneficial';
    headline: string;
    description: string;
    daysOfAllowanceImpact: number;
  };
}

export interface FinancialHealthScore {
  totalScore: number; // 0 - 100
  riskLevel: 'Stable' | 'Caution' | 'High Risk';
  breakdown: {
    runwayScore: number; // max 30
    dailyAllowanceScore: number; // max 30
    commitmentCoverageScore: number; // max 20
    savingsProgressScore: number; // max 20
  };
  keyFactor: string;
  improvementTip: string;
}

export interface FinanceSettings {
  startingBudget: number;
  totalCycleDays: number;
  currentDay: number; // Day 12
  startDate: string; // YYYY-MM-DD
  currencySymbol: string;
}

export interface FinanceState {
  settings: FinanceSettings;
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  commitments: Commitment[];
}
