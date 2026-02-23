// Transaction types
export type TransactionType = "income" | "expense" | "transfer" | "debt_repayment"

export interface Transaction {
  id: string
  amount: number
  date: string
  type: TransactionType
  categoryId: string
  accountId: string
  debtId?: string
  userId: string
  note: string
  createdAt: string
  updatedAt: string
}

// Category types
export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  parentId?: string
  icon?: string
  color?: string
}

// Account types
export type AccountType = "cash" | "bank" | "credit_card"

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  currency: string
  institution?: string
  lastFourDigits?: string
}

// Debt types
export type DebtType = "fixed_term" | "revolving"

export interface Debt {
  id: string
  name: string
  totalAmount: number
  monthlyInstallment: number
  remainingBalance: number
  dueDate: string
  type: DebtType
  limit?: number // For revolving credit
  interestRate?: number
  startDate: string
  color?: string
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  avatar?: string
}

// Dashboard types
export interface FinancialSummary {
  netWorth: number
  totalAssets: number
  totalDebts: number
  monthlyIncome: number
  monthlyExpense: number
  burnRate: number
  cashflow: number
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  color?: string
}

export interface MonthlyComparison {
  month: string
  income: number
  expense: number
}

// Form types
export interface TransactionFormData {
  amount: number
  date: string
  type: TransactionType
  categoryId: string
  accountId: string
  debtId?: string
  note: string
  payer: "husband" | "wife"
}

export interface CategoryFormData {
  name: string
  type: "income" | "expense"
  parentId?: string
  icon?: string
  color?: string
}

export interface DebtFormData {
  name: string
  totalAmount: number
  monthlyInstallment: number
  dueDate: string
  type: DebtType
  limit?: number
  interestRate?: number
  startDate: string
  color?: string
}
