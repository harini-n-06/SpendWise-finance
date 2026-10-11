# SpendWise 💸

### Spend smarter. Plan better. Stay in control.

SpendWise is an interactive personal finance simulator designed for Gen Z. It helps users manage a limited budget of ₹10,000 over 30 days, track expenses, plan savings, monitor upcoming commitments, and simulate financial decisions before making them.

Instead of simply recording expenses, SpendWise helps users understand how every financial decision affects their remaining balance, daily spending allowance, savings goals, and projected financial health.

## 🚀 Key Features

- **Personal Finance Dashboard** — View your budget, current balance, total spending, savings progress, and upcoming commitments.
- **Transaction Management** — Add, edit, delete, search, and filter income and expenses.
- **Budget Planner** — Monitor spending categories and understand where your money goes.
- **Decision Simulator** — Preview a purchase or financial decision and compare your financial position before confirming it.
- **Savings Goals** — Create savings goals, track progress, and record contributions.
- **Subscriptions & Commitments** — Track recurring subscriptions, unpaid bills, and upcoming payments.
- **30-Day Financial Forecast** — Estimate your future balance based on expected income, expenses, and commitments.
- **Financial Health Insights** — View estimated financial risk indicators and budgeting insights.
- **Persistent Data** — Save supported app data locally so it remains available after refreshing the page.
- **Responsive Design** — Use the application on desktop, tablet, and mobile screens.

## 💡 What Makes SpendWise Different?

Traditional expense trackers mainly show what you have already spent. SpendWise focuses on what might happen next.

Before purchasing an item worth ₹2,000, users can preview how the decision could affect:

- Remaining balance
- Safe daily spending allowance
- Savings goal progress
- Upcoming financial commitments
- Projected end-of-period balance

Users can review the outcome before confirming the decision, helping them make more informed spending choices.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Data Persistence:** Browser Local Storage
- **Version Control:** Git and GitHub
- **Deployment:** Vercel or another supported hosting platform

## 📊 Demo Scenario

| Financial Metric | Example Value |
|---|---:|
| Initial Budget | ₹10,000 |
| Planning Period | 30 days |
| Recorded Expenses | ₹2,800 |
| Current Balance | ₹7,200 |
| Unpaid Commitments | ₹1,200 |
| Savings Target | ₹2,000 |
| Days Remaining | 18 |

*These values are illustrative demo data, not real bank information. Actual values depend on the application's calculations and user actions.*

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git@github.com:harini-n-06/SpendWise-finance.git
```

**2. Navigate to the project directory**

```bash
cd spendwise-finance
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the local URL**

Visit the URL displayed in your terminal, usually `http://localhost:5173`.

## 🌐 Live Demo

- Live Application:https://spend-wise-finance-cyan.vercel.app/
- GitHub Repository:https://github.com/harini-n-06/SpendWise-finance.git

## 🔒 Privacy & Data

SpendWise is designed as a personal finance simulation tool. Demo transactions and financial values are illustrative and are not connected to real bank accounts.

If the application uses browser Local Storage, supported data is stored in the user's browser. Do not enter real banking credentials, payment card details, or other sensitive financial information.

## 🎯 Project Objective

The objective of SpendWise is to make financial planning more interactive and understandable for young adults by combining budgeting, expense tracking, savings management, financial forecasting, and decision simulation in one experience.

## 🔮 Future Enhancements

- Advanced financial forecasting
- Customizable financial goals and budgets
- Downloadable expense reports
- Improved spending pattern analysis
- Optional account-based synchronization with appropriate security
- Personalized insights based on user-entered financial data

## ⚠️ Disclaimer

SpendWise is an educational budgeting and financial simulation project. Its forecasts and financial health indicators are estimates, not guarantees or professional financial advice.

## 👩‍💻 Built For

A web development hackathon project focused on financial awareness, smarter spending, and informed decision-making.

---
**prompt**
Build **SpendWise**, a professional, fully functional, responsive personal finance web application for Gen Z.

**Goal:** Help users manage ₹10,000 over 30 days, make smarter financial decisions, and understand how spending affects their future balance.

**Tech stack:** React, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, and localStorage. Use reusable components, clean code, and shared financial state. No paid APIs or backend required.

**Design:** Create a premium fintech UI with midnight navy (#101827), white cards, lime green (#B8F36B) accents, clean typography, subtle shadows, rounded cards, consistent spacing, and responsive desktop/mobile layouts. Use a dark sidebar on desktop and compact navigation on mobile. Avoid clutter and generic dashboard styling.

**Pages and features:**

1. **Dashboard:** Starting budget, current balance, actual spending, unpaid commitments, savings progress, days remaining, safe daily allowance, spending breakdown chart, 30-day forecast chart, recent transactions, upcoming bills, financial health score, and actionable insights.

2. **Transactions:** Add, edit, delete, search, filter, and categorize income and expenses. Validate forms and update all related metrics immediately.

3. **Budget Planner:** Set category limits, compare planned versus actual spending, display remaining budgets, and warn about overspending.

4. **Decision Simulator — signature feature:** Let users simulate purchases, unexpected expenses, subscriptions, additional income, savings contributions, and commitment changes. Show before-and-after comparisons for balance, daily allowance, month-end forecast, savings goals, and financial risk. Update results instantly when the amount changes. Include Confirm and Cancel. Preview and Cancel must never change saved data; Confirm must apply the decision exactly once.

5. **Savings Goals:** Create, edit, delete, and contribute to goals. Display target amount, saved amount, progress, remaining amount, target date, and estimated feasibility.

6. **Commitments & Subscriptions:** Add and manage upcoming bills, recurring subscriptions, due dates, payment status, and cancellation. Account for future recurring expenses correctly and never double-count paid bills.

7. **Insights & Forecast:** Show projected month-end balance, spending trends, stable/caution/high-risk status, scenario comparisons, and a transparent illustrative financial health score. Explain every recommendation using actual data. Do not present the score as a credit score.

**Initial demo data:** ₹10,000 starting budget, 30-day period, ₹2,800 total recorded expenses, ₹7,200 current balance, ₹1,200 unpaid commitments, ₹2,000 savings target, and 18 days remaining. Ensure every value and transaction is internally consistent.

**Calculation rules:**
- Balance = opening balance + recorded income − recorded expenses.
- Safe daily allowance = max(0, balance − unpaid commitments − remaining savings requirement) / days remaining.
- Forecast = current balance + expected future income − expected future expenses − unpaid commitments.
- Prevent double-counting of subscriptions, paid commitments, and savings contributions. Handle zero days and negative forecasts safely.

**Functionality:** Use centralized TypeScript calculation functions and a single source of truth. Persist transactions, budgets, goals, commitments, subscriptions, and settings in localStorage. Provide a Reset Demo button with confirmation. Every button, form, navigation item, chart, and simulator action must work. Include validation, notifications, confirmation dialogs, empty states, accessible labels, keyboard navigation, and clear error messages.

**Quality requirements:** No static-only mockups, dead buttons, fake data changes, hardcoded simulator results, fake bank connections, or unnecessary features. All dashboard metrics, charts, forecasts, and insights must update after confirmed actions. Ensure responsive design, consistent rupee formatting, and no major runtime or TypeScript errors.

**Build priority:** First implement the shared state, calculation engine, dashboard, and working decision simulator. Then build transactions, budgets, savings, subscriptions, and forecasts. Finish with responsive polish and testing.

Build the actual application now, not just a plan. Verify calculations, preview/cancel/confirm behavior, persistence after refresh, Reset Demo, and mobile responsiveness. Prioritize a polished, reliable, hackathon-ready product over extra features.

Tagline: “Spend smarter. Plan better. Stay in control.”
**SpendWise — Make every rupee count.**
