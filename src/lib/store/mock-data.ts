// Mock data for frontend prototype
import type { User, Account, Category, Debt, Transaction, FinancialSummary, MonthlyComparison, CategorySpending } from "@/lib/types"

export const mockUsers: User[] = [
  { id: "1", name: "Husband", email: "husband@familyfin.com", role: "admin" },
  { id: "2", name: "Wife", email: "wife@familyfin.com", role: "member" },
]

export const mockAccounts: Account[] = [
  { id: "1", name: "Cash", type: "cash", balance: 2500000, currency: "IDR" },
  { id: "2", name: "BCA Savings", type: "bank", balance: 15000000, currency: "IDR", institution: "Bank Central Asia" },
  { id: "3", name: "Mandiri CC", type: "credit_card", balance: -3500000, currency: "IDR", institution: "Bank Mandiri", lastFourDigits: "1234" },
]

export const mockCategories: Category[] = [
  // Income categories
  { id: "1", name: "Salary", type: "income", color: "#22c55e" },
  { id: "2", name: "Bonus", type: "income", color: "#16a34a" },
  { id: "3", name: "Investment", type: "income", color: "#15803d" },
  
  // Expense categories - Household
  { id: "4", name: "Household", type: "expense", color: "#f97316" },
  { id: "5", name: "Nanny", type: "expense", parentId: "4", color: "#ea580c" },
  { id: "6", name: "Groceries", type: "expense", color: "#f59e0b" },
  { id: "7", name: "Utilities", type: "expense", color: "#d97706" },
  
  // Expense categories - Transport
  { id: "8", name: "Transport", type: "expense", color: "#3b82f6" },
  { id: "9", name: "Fuel", type: "expense", parentId: "8", color: "#2563eb" },
  { id: "10", name: "Parking", type: "expense", parentId: "8", color: "#1d4ed8" },
  
  // Expense categories - Baby
  { id: "11", name: "Baby Supplies", type: "expense", color: "#ec4899" },
  { id: "12", name: "Diapers", type: "expense", parentId: "11", color: "#db2777" },
  { id: "13", name: "Formula", type: "expense", parentId: "11", color: "#be185d" },
  
  // Expense categories - Food
  { id: "14", name: "Food & Dining", type: "expense", color: "#8b5cf6" },
  { id: "15", name: "Restaurants", type: "expense", parentId: "14", color: "#7c3aed" },
  
  // Expense categories - Debt
  { id: "16", name: "Debt Repayment", type: "expense", color: "#ef4444" },
]

export const mockDebts: Debt[] = [
  {
    id: "1",
    name: "Car Loan",
    totalAmount: 150000000,
    monthlyInstallment: 4500000,
    remainingBalance: 98000000,
    dueDate: "2027-06-15",
    type: "fixed_term",
    startDate: "2023-06-15",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Mandiri Credit Card",
    totalAmount: 10000000,
    monthlyInstallment: 2000000,
    remainingBalance: 3500000,
    dueDate: "2025-12-31",
    type: "revolving",
    limit: 10000000,
    interestRate: 2.5,
    startDate: "2024-01-01",
    color: "#ef4444",
  },
  {
    id: "3",
    name: "Home Paylater",
    totalAmount: 5000000,
    monthlyInstallment: 500000,
    remainingBalance: 2000000,
    dueDate: "2025-06-30",
    type: "revolving",
    limit: 5000000,
    interestRate: 1.5,
    startDate: "2024-06-01",
    color: "#f59e0b",
  },
]

export const mockTransactions: Transaction[] = [
  { id: "1", amount: 8000000, date: "2025-02-01", type: "income", categoryId: "1", accountId: "2", userId: "1", note: "February Salary", createdAt: "2025-02-01T00:00:00Z", updatedAt: "2025-02-01T00:00:00Z" },
  { id: "2", amount: 6500000, date: "2025-02-01", type: "income", categoryId: "1", accountId: "2", userId: "2", note: "February Salary", createdAt: "2025-02-01T00:00:00Z", updatedAt: "2025-02-01T00:00:00Z" },
  { id: "3", amount: 4500000, date: "2025-02-05", type: "expense", categoryId: "5", accountId: "1", userId: "1", note: "Nanny monthly salary", createdAt: "2025-02-05T00:00:00Z", updatedAt: "2025-02-05T00:00:00Z" },
  { id: "4", amount: 1500000, date: "2025-02-07", type: "expense", categoryId: "6", accountId: "1", userId: "2", note: "Weekly groceries", createdAt: "2025-02-07T00:00:00Z", updatedAt: "2025-02-07T00:00:00Z" },
  { id: "5", amount: 500000, date: "2025-02-10", type: "expense", categoryId: "9", accountId: "1", userId: "1", note: "Fuel fill-up", createdAt: "2025-02-10T00:00:00Z", updatedAt: "2025-02-10T00:00:00Z" },
  { id: "6", amount: 800000, date: "2025-02-12", type: "expense", categoryId: "12", accountId: "3", userId: "2", note: "Diapers stock up", createdAt: "2025-02-12T00:00:00Z", updatedAt: "2025-02-12T00:00:00Z" },
  { id: "7", amount: 350000, date: "2025-02-14", type: "expense", categoryId: "15", accountId: "3", userId: "1", note: "Valentine dinner", createdAt: "2025-02-14T00:00:00Z", updatedAt: "2025-02-14T00:00:00Z" },
  { id: "8", amount: 2000000, date: "2025-02-15", type: "debt_repayment", categoryId: "16", accountId: "2", debtId: "2", userId: "1", note: "CC minimum payment", createdAt: "2025-02-15T00:00:00Z", updatedAt: "2025-02-15T00:00:00Z" },
  { id: "9", amount: 4500000, date: "2025-02-15", type: "debt_repayment", categoryId: "16", accountId: "2", debtId: "1", userId: "1", note: "Car loan installment", createdAt: "2025-02-15T00:00:00Z", updatedAt: "2025-02-15T00:00:00Z" },
  { id: "10", amount: 750000, date: "2025-02-18", type: "expense", categoryId: "7", accountId: "2", userId: "2", note: "Electricity bill", createdAt: "2025-02-18T00:00:00Z", updatedAt: "2025-02-18T00:00:00Z" },
  { id: "11", amount: 300000, date: "2025-02-20", type: "expense", categoryId: "10", accountId: "1", userId: "1", note: "Monthly parking", createdAt: "2025-02-20T00:00:00Z", updatedAt: "2025-02-20T00:00:00Z" },
  { id: "12", amount: 500000, date: "2025-02-21", type: "expense", categoryId: "13", accountId: "3", userId: "2", note: "Baby formula", createdAt: "2025-02-21T00:00:00Z", updatedAt: "2025-02-21T00:00:00Z" },
]

export const mockFinancialSummary: FinancialSummary = {
  netWorth: 14000000, // Total Assets (17.5M) - Total Debts (3.5M)
  totalAssets: 17500000,
  totalDebts: 3500000,
  monthlyIncome: 14500000,
  monthlyExpense: 13685000,
  burnRate: 456167, // Daily average
  cashflow: 815000, // Income - Expense
}

export const mockMonthlyComparison: MonthlyComparison[] = [
  { month: "Sep", income: 14500000, expense: 12000000 },
  { month: "Oct", income: 15000000, expense: 13500000 },
  { month: "Nov", income: 14500000, expense: 11000000 },
  { month: "Dec", income: 18000000, expense: 16000000 },
  { month: "Jan", income: 14500000, expense: 12500000 },
  { month: "Feb", income: 14500000, expense: 13685000 },
]

export const mockCategorySpending: CategorySpending[] = [
  { categoryId: "5", categoryName: "Nanny", amount: 4500000, percentage: 32.9, color: "#ea580c" },
  { categoryId: "6", categoryName: "Groceries", amount: 1500000, percentage: 11.0, color: "#f59e0b" },
  { categoryId: "16", categoryName: "Debt Repayment", amount: 6500000, percentage: 47.5, color: "#ef4444" },
  { categoryId: "12", categoryName: "Diapers", amount: 800000, percentage: 5.8, color: "#db2777" },
  { categoryId: "9", categoryName: "Fuel", amount: 500000, percentage: 3.7, color: "#2563eb" },
  { categoryId: "15", categoryName: "Restaurants", amount: 350000, percentage: 2.6, color: "#7c3aed" },
  { categoryId: "7", categoryName: "Utilities", amount: 750000, percentage: 5.5, color: "#d97706" },
  { categoryId: "10", categoryName: "Parking", amount: 300000, percentage: 2.2, color: "#1d4ed8" },
  { categoryId: "13", categoryName: "Formula", amount: 500000, percentage: 3.7, color: "#be185d" },
]
