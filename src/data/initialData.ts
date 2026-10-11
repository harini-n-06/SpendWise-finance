import { FinanceState } from '../types/finance';

export const INITIAL_FINANCE_STATE: FinanceState = {
  settings: {
    startingBudget: 10000,
    totalCycleDays: 30,
    currentDay: 12, // 18 days remaining
    startDate: '2026-10-01',
    currencySymbol: '₹',
  },
  budgetCategories: [
    {
      id: 'cat_food',
      category: 'Food & Dining',
      allocatedAmount: 2500,
      color: '#F59E0B', // Amber
    },
    {
      id: 'cat_groceries',
      category: 'Groceries',
      allocatedAmount: 1800,
      color: '#10B981', // Emerald
    },
    {
      id: 'cat_transit',
      category: 'Commute & Transit',
      allocatedAmount: 1200,
      color: '#3B82F6', // Blue
    },
    {
      id: 'cat_entertainment',
      category: 'Entertainment',
      allocatedAmount: 1000,
      color: '#8B5CF6', // Purple
    },
    {
      id: 'cat_utilities',
      category: 'Utilities & Bills',
      allocatedAmount: 1000,
      color: '#06B6D4', // Cyan
    },
    {
      id: 'cat_health',
      category: 'Health & Fitness',
      allocatedAmount: 1000,
      color: '#EC4899', // Pink
    },
    {
      id: 'cat_shopping',
      category: 'Shopping & Style',
      allocatedAmount: 1000,
      color: '#F97316', // Orange
    },
    {
      id: 'cat_education',
      category: 'Education & Books',
      allocatedAmount: 500,
      color: '#6366F1', // Indigo
    },
  ],
  transactions: [
    {
      id: 'tx_1',
      title: 'Monthly Metro & Bus Pass',
      amount: 600,
      type: 'expense',
      category: 'Commute & Transit',
      date: '2026-10-01',
      dayOfCycle: 1,
      notes: 'Smart card recharge for daily campus commute',
    },
    {
      id: 'tx_2',
      title: 'Weekly Supermarket Haul',
      amount: 750,
      type: 'expense',
      category: 'Groceries',
      date: '2026-10-03',
      dayOfCycle: 3,
      notes: 'Oats, milk, eggs, veggies, coffee',
    },
    {
      id: 'tx_3',
      title: 'Café & Study Snack',
      amount: 220,
      type: 'expense',
      category: 'Food & Dining',
      date: '2026-10-05',
      dayOfCycle: 5,
      notes: 'Cold brew and croissant while studying',
    },
    {
      id: 'tx_4',
      title: 'Campus Canteen Lunch & Juice',
      amount: 180,
      type: 'expense',
      category: 'Food & Dining',
      date: '2026-10-07',
      dayOfCycle: 7,
      notes: 'Lunch combo with classmates',
    },
    {
      id: 'tx_5',
      title: 'Notebooks & Engineering Pens',
      amount: 350,
      type: 'expense',
      category: 'Education & Books',
      date: '2026-10-08',
      dayOfCycle: 8,
      notes: 'Stationery and spiral notebook pack',
    },
    {
      id: 'tx_6',
      title: 'Weekend Dinner with Roommates',
      amount: 420,
      type: 'expense',
      category: 'Food & Dining',
      date: '2026-10-10',
      dayOfCycle: 10,
      notes: 'Split bill pizza night',
    },
    {
      id: 'tx_7',
      title: 'Pharmacy Vitamins & Protein Bars',
      amount: 280,
      type: 'expense',
      category: 'Health & Fitness',
      date: '2026-10-11',
      dayOfCycle: 11,
      notes: 'Electrolytes & workout snacks',
    },
  ],
  commitments: [
    {
      id: 'com_1',
      title: 'High-Speed Broadband WiFi',
      amount: 600,
      dueDate: '2026-10-16',
      dueDayOfCycle: 16,
      category: 'Utilities & Bills',
      frequency: 'monthly',
      isPaid: false,
      isAutoPay: true,
    },
    {
      id: 'com_2',
      title: 'Spotify Student Premium',
      amount: 119,
      dueDate: '2026-10-19',
      dueDayOfCycle: 19,
      category: 'Entertainment',
      frequency: 'monthly',
      isPaid: false,
      isAutoPay: true,
    },
    {
      id: 'com_3',
      title: 'Campus Gym & Fitness Access',
      amount: 481,
      dueDate: '2026-10-24',
      dueDayOfCycle: 24,
      category: 'Health & Fitness',
      frequency: 'monthly',
      isPaid: false,
      isAutoPay: false,
    },
  ],
  savingsGoals: [
    {
      id: 'goal_1',
      title: 'Emergency Cushion / Goa Trip',
      targetAmount: 2000,
      savedAmount: 500,
      targetDate: '2026-10-31',
      category: 'Emergency & Travel',
      notes: 'Dedicated 20% savings buffer for cycle end',
    },
  ],
};
