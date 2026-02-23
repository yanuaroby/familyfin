import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

// Users table (BetterAuth compatible)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  password: text("password"), // BetterAuth expects this field name
  image: text("image"), // BetterAuth expects this for avatar
  role: text("role", { enum: ["admin", "member"] }).default("member"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// BetterAuth Account table (for OAuth providers)
export const betterAuthAccounts = sqliteTable("better_auth_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: text("access_token_expires_at"),
  refreshTokenExpiresAt: text("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// BetterAuth Session table
export const betterAuthSessions = sqliteTable("better_auth_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// BetterAuth Verification table
export const betterAuthVerifications = sqliteTable("better_auth_verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Wallets table (for Dompet Saya - separate balances per user)
export const wallets = sqliteTable("wallets", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["cash", "bank", "credit_card"] }).notNull(),
  balance: real("balance").default(0).notNull(),
  currency: text("currency").default("IDR").notNull(),
  institution: text("institution"),
  lastFourDigits: text("last_four_digits"),
  color: text("color").default("#888888"),
  icon: text("icon"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Categories table (with nested support via parentId)
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  parentId: text("parent_id").references((): any => categories.id),
  icon: text("icon"),
  color: text("color").default("#888888"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Accounts table (Cash, Bank, Credit Card)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["cash", "bank", "credit_card"] }).notNull(),
  balance: real("balance").default(0).notNull(),
  currency: text("currency").default("IDR").notNull(),
  institution: text("institution"),
  lastFourDigits: text("last_four_digits"),
  color: text("color").default("#888888"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Debts table (Fixed Term and Revolving)
export const debts = sqliteTable("debts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["fixed_term", "revolving"] }).notNull(),
  totalAmount: real("total_amount").notNull(),
  remainingBalance: real("remaining_balance").notNull(),
  monthlyInstallment: real("monthly_installment").notNull(),
  dueDate: text("due_date").notNull(),
  startDate: text("start_date").notNull(),
  limit: real("limit"), // For revolving credit
  interestRate: real("interest_rate"), // Annual interest rate
  color: text("color").default("#888888"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  type: text("type", { enum: ["income", "expense", "transfer", "debt_repayment"] }).notNull(),
  categoryId: text("category_id").references(() => categories.id),
  walletId: text("wallet_id").references(() => wallets.id).notNull(),
  debtId: text("debt_id").references(() => debts.id),
  userId: text("user_id").references(() => users.id).notNull(),
  note: text("note"),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurringTemplateId: text("recurring_template_id").references(() => recurringTransactions.id),
  receiptImage: text("receipt_image"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Streaks table (for gamification)
export const streaks = sqliteTable("streaks", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull().unique(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActivityDate: text("last_activity_date"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Budgets table (monthly budget per category)
export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  categoryId: text("category_id").references(() => categories.id).notNull(),
  monthlyLimit: real("monthly_limit").notNull(),
  spent: real("spent").default(0).notNull(),
  period: text("period").notNull(), // Format: "YYYY-MM"
  alertThreshold: real("alert_threshold").default(80), // Percentage
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Goals table (savings goals)
export const goals = sqliteTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").default(0).notNull(),
  deadline: text("deadline"),
  color: text("color").default("#888888"),
  icon: text("icon"),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Activity Logs table (for shared feed)
export const activityLogs = sqliteTable("activity_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // "created", "updated", "deleted"
  entityType: text("entity_type").notNull(), // "transaction", "debt", "category", etc.
  entityId: text("entity_id").notNull(),
  metadata: text("metadata"), // JSON string with additional info
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Recurring Transactions table
export const recurringTransactions = sqliteTable("recurring_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: real("amount").notNull(),
  categoryId: text("category_id").references(() => categories.id).notNull(),
  accountId: text("account_id").references(() => accounts.id).notNull(),
  debtId: text("debt_id").references(() => debts.id),
  type: text("type", { enum: ["income", "expense", "debt_repayment"] }).notNull(),
  note: text("note"),
  frequency: text("frequency", { enum: ["daily", "weekly", "monthly", "yearly"] }).notNull(),
  startDate: text("start_date").notNull(),
  nextRun: text("next_run").notNull(),
  lastRun: text("last_run"),
  isEnabled: integer("is_enabled", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Debt Payments history table
export const debtPayments = sqliteTable("debt_payments", {
  id: text("id").primaryKey(),
  debtId: text("debt_id").references(() => debts.id).notNull(),
  transactionId: text("transaction_id").references(() => transactions.id).notNull(),
  amount: real("amount").notNull(),
  previousBalance: real("previous_balance").notNull(),
  newBalance: real("new_balance").notNull(),
  paymentDate: text("payment_date").notNull(),
  note: text("note"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Wallet = typeof wallets.$inferSelect
export type NewWallet = typeof wallets.$inferInsert
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Debt = typeof debts.$inferSelect
export type NewDebt = typeof debts.$inferInsert
export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
export type Streak = typeof streaks.$inferSelect
export type NewStreak = typeof streaks.$inferInsert
export type Budget = typeof budgets.$inferSelect
export type NewBudget = typeof budgets.$inferInsert
export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
export type ActivityLog = typeof activityLogs.$inferSelect
export type NewActivityLog = typeof activityLogs.$inferInsert
export type RecurringTransaction = typeof recurringTransactions.$inferSelect
export type NewRecurringTransaction = typeof recurringTransactions.$inferInsert
export type DebtPayment = typeof debtPayments.$inferSelect
export type NewDebtPayment = typeof debtPayments.$inferInsert
