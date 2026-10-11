import {
  FinanceState,
  FinancialHealthScore,
  SimulationParams,
  SimulationResult,
  Category,
  Transaction,
} from '../types/finance';

/**
 * Format number as Indian Rupee string (e.g. ₹10,000 or ₹2,800)
 */
export function formatINR(amount: number, showDecimals = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = showDecimals
    ? absAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : absAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Calculates current balance:
 * Balance = starting budget + recorded income - recorded expenses
 */
export function calculateBalance(state: FinanceState): number {
  const { startingBudget } = state.settings;
  
  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return startingBudget + totalIncome - totalExpenses;
}

/**
 * Calculates total recorded expenses
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculates total recorded income
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculates unpaid commitments total
 */
export function calculateUnpaidCommitments(state: FinanceState): number {
  return state.commitments
    .filter((c) => !c.isPaid)
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Calculates total savings target and current saved
 */
export function calculateSavingsSummary(state: FinanceState): {
  totalTarget: number;
  totalSaved: number;
  remainingRequirement: number;
  progressPercent: number;
} {
  const totalTarget = state.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = state.savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
  const remainingRequirement = Math.max(0, totalTarget - totalSaved);
  const progressPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return {
    totalTarget,
    totalSaved,
    remainingRequirement,
    progressPercent,
  };
}

/**
 * Days remaining in the cycle
 */
export function calculateDaysRemaining(state: FinanceState): number {
  return Math.max(0, state.settings.totalCycleDays - state.settings.currentDay);
}

/**
 * Safe Daily Allowance:
 * max(0, balance - unpaid commitments - remaining savings requirement) / days remaining
 */
export function calculateSafeDailyAllowance(state: FinanceState): number {
  const daysRemaining = calculateDaysRemaining(state);
  if (daysRemaining <= 0) return 0;

  const balance = calculateBalance(state);
  const unpaidCommitments = calculateUnpaidCommitments(state);
  const { remainingRequirement } = calculateSavingsSummary(state);

  const freeCash = Math.max(0, balance - unpaidCommitments - remainingRequirement);
  return freeCash / daysRemaining;
}

/**
 * Calculates daily burn rate so far
 */
export function calculateAverageDailyBurn(state: FinanceState): number {
  const currentDay = Math.max(1, state.settings.currentDay);
  const totalExpenses = calculateTotalExpenses(state.transactions);
  return totalExpenses / currentDay;
}

/**
 * Month-End Forecast:
 * Projected balance at day 30 assuming:
 * Current balance - unpaid commitments - (daily burn rate * days remaining) + future known income
 */
export function calculateMonthEndForecast(state: FinanceState): {
  projectedBalance: number;
  projectedSpendingRemaining: number;
  projectedSavingsAchieved: number;
  isDeficit: boolean;
} {
  const balance = calculateBalance(state);
  const unpaidCommitments = calculateUnpaidCommitments(state);
  const daysRemaining = calculateDaysRemaining(state);
  const dailyBurn = calculateAverageDailyBurn(state);
  const { totalSaved } = calculateSavingsSummary(state);

  // If daily burn continues
  const projectedSpendingRemaining = dailyBurn * daysRemaining;
  const projectedBalance = balance - unpaidCommitments - projectedSpendingRemaining;

  return {
    projectedBalance,
    projectedSpendingRemaining,
    projectedSavingsAchieved: totalSaved,
    isDeficit: projectedBalance < 0,
  };
}

/**
 * Financial Health Score (0 - 100)
 * Transparent educational score based on 4 concrete pillars:
 * 1. Budget Runway vs Cycle Progress (30 points)
 * 2. Safe Daily Allowance Adherence (30 points)
 * 3. Commitment Coverage Cushion (20 points)
 * 4. Savings Goal Attainment (20 points)
 */
export function calculateFinancialHealthScore(state: FinanceState): FinancialHealthScore {
  const balance = calculateBalance(state);
  const startingBudget = state.settings.startingBudget;
  const daysRemaining = calculateDaysRemaining(state);
  const totalDays = state.settings.totalCycleDays;
  const safeDaily = calculateSafeDailyAllowance(state);
  const unpaidCommitments = calculateUnpaidCommitments(state);
  const { progressPercent, remainingRequirement } = calculateSavingsSummary(state);

  // Pillar 1: Runway Score (max 30)
  // Expected remaining balance ratio vs time remaining ratio
  const timeRemainingRatio = totalDays > 0 ? daysRemaining / totalDays : 0;
  const balanceRatio = startingBudget > 0 ? balance / startingBudget : 0;
  let runwayScore = 0;
  if (balanceRatio >= timeRemainingRatio) {
    runwayScore = 30;
  } else if (balanceRatio > 0 && timeRemainingRatio > 0) {
    runwayScore = Math.max(5, Math.round((balanceRatio / timeRemainingRatio) * 30));
  } else {
    runwayScore = 0;
  }

  // Pillar 2: Safe Daily Allowance Score (max 30)
  // Baseline original daily budget: startingBudget / totalDays (e.g. 10000 / 30 = 333.33)
  const initialDailyBaseline = totalDays > 0 ? startingBudget / totalDays : 333;
  let dailyAllowanceScore = 0;
  if (safeDaily >= initialDailyBaseline * 0.9) {
    dailyAllowanceScore = 30;
  } else if (safeDaily >= initialDailyBaseline * 0.7) {
    dailyAllowanceScore = 24;
  } else if (safeDaily >= initialDailyBaseline * 0.5) {
    dailyAllowanceScore = 18;
  } else if (safeDaily > 0) {
    dailyAllowanceScore = Math.max(5, Math.round((safeDaily / initialDailyBaseline) * 30));
  } else {
    dailyAllowanceScore = 0;
  }

  // Pillar 3: Commitment Coverage Score (max 20)
  // Does current balance comfortably cover upcoming unpaid commitments?
  let commitmentCoverageScore = 20;
  if (balance <= 0) {
    commitmentCoverageScore = 0;
  } else if (unpaidCommitments > 0) {
    const commitmentRatio = unpaidCommitments / balance;
    if (commitmentRatio <= 0.25) {
      commitmentCoverageScore = 20;
    } else if (commitmentRatio <= 0.5) {
      commitmentCoverageScore = 15;
    } else if (commitmentRatio <= 0.8) {
      commitmentCoverageScore = 10;
    } else {
      commitmentCoverageScore = 5;
    }
  }

  // Pillar 4: Savings Progress Score (max 20)
  let savingsProgressScore = 0;
  if (remainingRequirement === 0) {
    savingsProgressScore = 20;
  } else {
    // If savings is on track or has progress
    savingsProgressScore = Math.min(20, Math.round((progressPercent / 100) * 15) + (safeDaily > 150 ? 5 : 0));
  }

  const totalScore = Math.min(100, Math.max(0, runwayScore + dailyAllowanceScore + commitmentCoverageScore + savingsProgressScore));

  let riskLevel: 'Stable' | 'Caution' | 'High Risk' = 'Stable';
  if (totalScore >= 75) {
    riskLevel = 'Stable';
  } else if (totalScore >= 50) {
    riskLevel = 'Caution';
  } else {
    riskLevel = 'High Risk';
  }

  let keyFactor = 'Your spending pace is controlled and leaves a strong cushion.';
  let improvementTip = 'Continue staying within your ₹' + Math.round(safeDaily) + '/day safe allowance.';

  if (safeDaily < 150) {
    keyFactor = 'Safe daily allowance is running tight for the remaining ' + daysRemaining + ' days.';
    improvementTip = 'Defer non-essential shopping until next month cycle.';
  } else if (unpaidCommitments > balance * 0.4) {
    keyFactor = 'Upcoming unpaid commitments absorb over 40% of your current balance.';
    improvementTip = 'Clear or budget for commitments before taking on any new subscriptions.';
  } else if (runwayScore < 20) {
    keyFactor = 'Spending velocity so far has exceeded the expected daily milestone.';
    improvementTip = 'Trim daily food delivery & impulsive purchases to rebuild cushion.';
  }

  return {
    totalScore,
    riskLevel,
    breakdown: {
      runwayScore,
      dailyAllowanceScore,
      commitmentCoverageScore,
      savingsProgressScore,
    },
    keyFactor,
    improvementTip,
  };
}

/**
 * Category spending breakdown
 */
export function calculateCategorySpending(state: FinanceState): {
  category: Category;
  spent: number;
  allocated: number;
  remaining: number;
  percentUsed: number;
  color: string;
}[] {
  const expenseTransactions = state.transactions.filter((t) => t.type === 'expense');
  
  return state.budgetCategories.map((bc) => {
    const spent = expenseTransactions
      .filter((t) => t.category === bc.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = Math.max(0, bc.allocatedAmount - spent);
    const percentUsed = bc.allocatedAmount > 0 ? Math.round((spent / bc.allocatedAmount) * 100) : 0;

    return {
      category: bc.category,
      spent,
      allocated: bc.allocatedAmount,
      remaining,
      percentUsed,
      color: bc.color,
    };
  });
}

/**
 * 30-Day Trajectory Curve:
 * Generates day 1 to 30 data points.
 * - Days 1 to currentDay: Actual historical cumulative spending & actual balance
 * - Days currentDay to 30: Projected trajectory based on safe daily allowance and scheduled commitments
 */
export function generate30DayTrajectory(state: FinanceState): {
  day: number;
  dateLabel: string;
  isPast: boolean;
  isToday: boolean;
  actualBalance?: number;
  projectedBalance: number;
  safeCeilingBalance: number;
  cumulativeSpend: number;
}[] {
  const { totalCycleDays, currentDay, startingBudget } = state.settings;
  const safeDaily = calculateSafeDailyAllowance(state);
  const currentBalance = calculateBalance(state);

  // Group transactions by day
  const spendByDay: Record<number, number> = {};
  for (let i = 1; i <= totalCycleDays; i++) {
    spendByDay[i] = 0;
  }
  
  state.transactions.forEach((t) => {
    if (t.dayOfCycle >= 1 && t.dayOfCycle <= totalCycleDays) {
      if (t.type === 'expense') {
        spendByDay[t.dayOfCycle] = (spendByDay[t.dayOfCycle] || 0) + t.amount;
      } else {
        spendByDay[t.dayOfCycle] = (spendByDay[t.dayOfCycle] || 0) - t.amount;
      }
    }
  });

  // Commitments due on specific days
  const commitmentByDay: Record<number, number> = {};
  state.commitments.forEach((c) => {
    if (!c.isPaid && c.dueDayOfCycle > currentDay) {
      commitmentByDay[c.dueDayOfCycle] = (commitmentByDay[c.dueDayOfCycle] || 0) + c.amount;
    }
  });

  const trajectory = [];
  let runningActualBalance = startingBudget;
  let runningCumulativeSpend = 0;

  // Compute history up to currentDay
  const historicalBalances: Record<number, number> = {};
  const historicalSpend: Record<number, number> = {};

  for (let d = 1; d <= currentDay; d++) {
    const netDayChange = spendByDay[d] || 0;
    runningCumulativeSpend += Math.max(0, netDayChange);
    runningActualBalance -= netDayChange;
    historicalBalances[d] = runningActualBalance;
    historicalSpend[d] = runningCumulativeSpend;
  }

  // Ensure balance at currentDay matches calculateBalance
  historicalBalances[currentDay] = currentBalance;

  let simulatedFutureBalance = currentBalance;
  for (let d = 1; d <= totalCycleDays; d++) {
    const isPast = d < currentDay;
    const isToday = d === currentDay;

    // Ideal linear budget ceiling curve
    const safeCeilingBalance = Math.max(0, startingBudget - (d * (startingBudget / totalCycleDays)));

    if (d <= currentDay) {
      trajectory.push({
        day: d,
        dateLabel: `Day ${d}`,
        isPast,
        isToday,
        actualBalance: historicalBalances[d],
        projectedBalance: historicalBalances[d],
        safeCeilingBalance: Math.round(safeCeilingBalance),
        cumulativeSpend: historicalSpend[d],
      });
    } else {
      // Future projection
      const dayCommitment = commitmentByDay[d] || 0;
      simulatedFutureBalance = Math.max(0, simulatedFutureBalance - safeDaily - dayCommitment);
      runningCumulativeSpend += safeDaily + dayCommitment;

      trajectory.push({
        day: d,
        dateLabel: `Day ${d}`,
        isPast: false,
        isToday: false,
        projectedBalance: Math.round(simulatedFutureBalance),
        safeCeilingBalance: Math.round(safeCeilingBalance),
        cumulativeSpend: Math.round(runningCumulativeSpend),
      });
    }
  }

  return trajectory;
}

/**
 * Pure Decision Simulator Engine:
 * Simulates any financial move without modifying saved state.
 */
export function simulateDecision(state: FinanceState, params: SimulationParams): SimulationResult {
  const currentBalance = calculateBalance(state);
  const currentSafeDaily = calculateSafeDailyAllowance(state);
  const currentForecast = calculateMonthEndForecast(state).projectedBalance;
  const currentHealth = calculateFinancialHealthScore(state);
  const daysRemaining = calculateDaysRemaining(state);

  // Clone state virtually
  const simulatedState: FinanceState = {
    ...state,
    transactions: [...state.transactions],
    commitments: [...state.commitments],
    savingsGoals: state.savingsGoals.map((g) => ({ ...g })),
    budgetCategories: state.budgetCategories.map((bc) => ({ ...bc })),
  };

  const amount = Math.max(0, params.amount);

  switch (params.type) {
    case 'purchase':
    case 'unexpected_bill': {
      simulatedState.transactions.push({
        id: 'sim_tx',
        title: params.title,
        amount,
        type: 'expense',
        category: params.category,
        date: new Date().toISOString().split('T')[0],
        dayOfCycle: state.settings.currentDay,
      });
      break;
    }
    case 'income': {
      simulatedState.transactions.push({
        id: 'sim_tx',
        title: params.title,
        amount,
        type: 'income',
        category: 'Freelance / Income',
        date: new Date().toISOString().split('T')[0],
        dayOfCycle: state.settings.currentDay,
      });
      break;
    }
    case 'subscription': {
      // Adds as a recurring commitment
      simulatedState.commitments.push({
        id: 'sim_sub',
        title: params.title,
        amount,
        dueDate: new Date().toISOString().split('T')[0],
        dueDayOfCycle: Math.min(30, state.settings.currentDay + 5),
        category: params.category,
        frequency: 'monthly',
        isPaid: false,
      });
      break;
    }
    case 'savings_deposit': {
      // Moves cash into savings goal
      if (params.targetGoalId) {
        const goal = simulatedState.savingsGoals.find((g) => g.id === params.targetGoalId);
        if (goal) {
          goal.savedAmount += amount;
        }
      } else if (simulatedState.savingsGoals.length > 0) {
        simulatedState.savingsGoals[0].savedAmount += amount;
      }
      // Recorded as expense from active balance into savings
      simulatedState.transactions.push({
        id: 'sim_save_tx',
        title: `Savings: ${params.title}`,
        amount,
        type: 'expense',
        category: 'Savings Transfer',
        date: new Date().toISOString().split('T')[0],
        dayOfCycle: state.settings.currentDay,
      });
      break;
    }
    case 'cancel_commitment': {
      // Finds commitment and removes or marks paid
      const index = simulatedState.commitments.findIndex((c) => c.title.toLowerCase().includes(params.title.toLowerCase()));
      if (index !== -1) {
        simulatedState.commitments.splice(index, 1);
      }
      break;
    }
  }

  const simulatedBalance = calculateBalance(simulatedState);
  const simulatedSafeDaily = calculateSafeDailyAllowance(simulatedState);
  const simulatedForecast = calculateMonthEndForecast(simulatedState).projectedBalance;
  const simulatedHealth = calculateFinancialHealthScore(simulatedState);

  const balanceDelta = simulatedBalance - currentBalance;
  const safeDailyDelta = simulatedSafeDaily - currentSafeDaily;
  const forecastDelta = simulatedForecast - currentForecast;
  const healthScoreDelta = simulatedHealth.totalScore - currentHealth.totalScore;

  // Days of daily allowance lost or gained
  const daysOfAllowanceImpact = currentSafeDaily > 0 
    ? Math.round((Math.abs(balanceDelta) / currentSafeDaily) * 10) / 10
    : 0;

  // Verdict generation
  let status: 'safe' | 'caution' | 'critical' | 'beneficial' = 'safe';
  let headline = 'Safe to Proceed';
  let description = `This decision fits within your cushion with ${formatINR(Math.round(simulatedSafeDaily))}/day remaining allowance.`;

  if (params.type === 'income') {
    status = 'beneficial';
    headline = 'Significant Boost to Runway';
    description = `Increases your safe daily allowance by ${formatINR(Math.round(safeDailyDelta))}/day for the remaining ${daysRemaining} days.`;
  } else if (simulatedSafeDaily <= 80 || simulatedForecast < 0) {
    status = 'critical';
    headline = 'High Risk of Deficit';
    description = `Warning: This spending slashes your safe allowance down to ${formatINR(Math.round(simulatedSafeDaily))}/day and may cause a month-end shortage.`;
  } else if (simulatedSafeDaily < 180 || safeDailyDelta < -50) {
    status = 'caution';
    headline = 'Moderate Budget Squeeze';
    description = `This decision consumes ~${daysOfAllowanceImpact} days of safe spending. You will need to tighten your daily budget.`;
  }

  return {
    currentBalance,
    simulatedBalance,
    balanceDelta,
    currentSafeDailyAllowance: currentSafeDaily,
    simulatedSafeDailyAllowance: simulatedSafeDaily,
    safeDailyDelta,
    currentMonthEndForecast: currentForecast,
    simulatedMonthEndForecast: simulatedForecast,
    forecastDelta,
    currentHealthScore: currentHealth.totalScore,
    simulatedHealthScore: simulatedHealth.totalScore,
    healthScoreDelta,
    currentRiskLevel: currentHealth.riskLevel,
    simulatedRiskLevel: simulatedHealth.riskLevel,
    verdict: {
      status,
      headline,
      description,
      daysOfAllowanceImpact,
    },
  };
}
