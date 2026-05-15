export interface Transaction {
  id:          string
  name:        string
  emoji:       string
  amount:      number
  type:        'credit' | 'debit'
  category:    Category
  date:        string
  description?: string
}

export type Category =
  | 'Housing'
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Health'
  | 'Shopping'
  | 'Income'
  | 'Other'

export interface Budget {
  id:       string
  category: Category
  emoji:    string
  limit:    number
  spent:    number
}

export interface SavingsGoal {
  id:        string
  name:      string
  emoji:     string
  target:    number
  current:   number
}

export interface MonthlySnapshot {
  month:    string
  income:   number
  expenses: number
}

export interface SpendingByCategory {
  category: Category
  amount:   number
  color:    string
}

export interface DashboardData {
  netWorth:      number
  netWorthChange: number
  monthlyIncome: number
  incomeChange:  number
  monthlyExpenses: number
  expensesChange: number
  savingsRate:   number
  liquidAssets:  number
  investments:   number
  realEstate:    number
  cashFlow:      number
  history:       MonthlySnapshot[]
  byCategory:    SpendingByCategory[]
  transactions:  Transaction[]
  budgets:       Budget[]
  goals:         SavingsGoal[]
}

export interface AiAnalysisRequest {
  netWorth:        number
  monthlyIncome:   number
  monthlyExpenses: number
  savingsRate:     number
  budgets:         Budget[]
  goals:           SavingsGoal[]
  topCategories:   SpendingByCategory[]
}
