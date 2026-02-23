import { db } from "."
import { categories, accounts, debts, streaks, wallets, users } from "./schema"
import { nanoid } from "nanoid"

// Helper to generate IDs
const generateId = () => nanoid(12)

async function seed() {
  console.log("🌱 Seeding database...")

  // Note: Users are created separately via BetterAuth signup or create-demo-users script

  // Get user IDs for wallet creation
  const allUsers = await db.select().from(users)
  const husbandUser = allUsers.find(u => u.email === "husband@familyfin.com")
  const wifeUser = allUsers.find(u => u.email === "wife@familyfin.com")

  // Create categories with nested structure
  const incomeCategories = [
    { id: generateId(), name: "Salary", type: "income" as const, color: "#22c55e", isDefault: true },
    { id: generateId(), name: "Bonus", type: "income" as const, color: "#16a34a", isDefault: true },
    { id: generateId(), name: "Investment", type: "income" as const, color: "#15803d", isDefault: true },
    { id: generateId(), name: "Freelance", type: "income" as const, color: "#14532d", isDefault: true },
    { id: generateId(), name: "Other Income", type: "income" as const, color: "#052e16", isDefault: true },
  ]

  const expenseParentCategories = [
    { id: generateId(), name: "Household", type: "expense" as const, color: "#f97316", isDefault: true },
    { id: generateId(), name: "Transport", type: "expense" as const, color: "#3b82f6", isDefault: true },
    { id: generateId(), name: "Baby Supplies", type: "expense" as const, color: "#ec4899", isDefault: true },
    { id: generateId(), name: "Food & Dining", type: "expense" as const, color: "#8b5cf6", isDefault: true },
    { id: generateId(), name: "Shopping", type: "expense" as const, color: "#f43f5e", isDefault: true },
    { id: generateId(), name: "Healthcare", type: "expense" as const, color: "#14b8a6", isDefault: true },
    { id: generateId(), name: "Entertainment", type: "expense" as const, color: "#f59e0b", isDefault: true },
    { id: generateId(), name: "Education", type: "expense" as const, color: "#6366f1", isDefault: true },
    { id: generateId(), name: "Debt Repayment", type: "expense" as const, color: "#ef4444", isDefault: true },
    { id: generateId(), name: "Other", type: "expense" as const, color: "#6b7280", isDefault: true },
  ]

  await db.insert(categories).values([
    ...incomeCategories,
    ...expenseParentCategories,
  ])
  console.log("✅ Created parent categories")

  // Create sub-categories
  const subCategories = [
    // Household sub-categories
    { id: generateId(), name: "Nanny", type: "expense" as const, parentId: expenseParentCategories[0].id, color: "#ea580c", isDefault: true },
    { id: generateId(), name: "Groceries", type: "expense" as const, parentId: expenseParentCategories[0].id, color: "#f59e0b", isDefault: true },
    { id: generateId(), name: "Utilities", type: "expense" as const, parentId: expenseParentCategories[0].id, color: "#d97706", isDefault: true },
    { id: generateId(), name: "Maintenance", type: "expense" as const, parentId: expenseParentCategories[0].id, color: "#b45309", isDefault: true },

    // Transport sub-categories
    { id: generateId(), name: "Fuel", type: "expense" as const, parentId: expenseParentCategories[1].id, color: "#2563eb", isDefault: true },
    { id: generateId(), name: "Parking", type: "expense" as const, parentId: expenseParentCategories[1].id, color: "#1d4ed8", isDefault: true },
    { id: generateId(), name: "Toll", type: "expense" as const, parentId: expenseParentCategories[1].id, color: "#1e40af", isDefault: true },
    { id: generateId(), name: "Service", type: "expense" as const, parentId: expenseParentCategories[1].id, color: "#1e3a8a", isDefault: true },

    // Baby Supplies sub-categories
    { id: generateId(), name: "Diapers", type: "expense" as const, parentId: expenseParentCategories[2].id, color: "#db2777", isDefault: true },
    { id: generateId(), name: "Formula", type: "expense" as const, parentId: expenseParentCategories[2].id, color: "#be185d", isDefault: true },
    { id: generateId(), name: "Clothes", type: "expense" as const, parentId: expenseParentCategories[2].id, color: "#9d174d", isDefault: true },
    { id: generateId(), name: "Toys", type: "expense" as const, parentId: expenseParentCategories[2].id, color: "#831843", isDefault: true },

    // Food & Dining sub-categories
    { id: generateId(), name: "Restaurants", type: "expense" as const, parentId: expenseParentCategories[3].id, color: "#7c3aed", isDefault: true },
    { id: generateId(), name: "Coffee", type: "expense" as const, parentId: expenseParentCategories[3].id, color: "#6d28d9", isDefault: true },
    { id: generateId(), name: "Snacks", type: "expense" as const, parentId: expenseParentCategories[3].id, color: "#5b21b6", isDefault: true },

    // Shopping sub-categories
    { id: generateId(), name: "Clothing", type: "expense" as const, parentId: expenseParentCategories[4].id, color: "#e11d48", isDefault: true },
    { id: generateId(), name: "Electronics", type: "expense" as const, parentId: expenseParentCategories[4].id, color: "#be123c", isDefault: true },
    { id: generateId(), name: "Home Items", type: "expense" as const, parentId: expenseParentCategories[4].id, color: "#9f1239", isDefault: true },

    // Healthcare sub-categories
    { id: generateId(), name: "Medicine", type: "expense" as const, parentId: expenseParentCategories[5].id, color: "#0d9488", isDefault: true },
    { id: generateId(), name: "Doctor", type: "expense" as const, parentId: expenseParentCategories[5].id, color: "#0f766e", isDefault: true },
    { id: generateId(), name: "Vitamins", type: "expense" as const, parentId: expenseParentCategories[5].id, color: "#115e59", isDefault: true },

    // Entertainment sub-categories
    { id: generateId(), name: "Movies", type: "expense" as const, parentId: expenseParentCategories[6].id, color: "#d97706", isDefault: true },
    { id: generateId(), name: "Streaming", type: "expense" as const, parentId: expenseParentCategories[6].id, color: "#b45309", isDefault: true },
    { id: generateId(), name: "Hobbies", type: "expense" as const, parentId: expenseParentCategories[6].id, color: "#92400e", isDefault: true },

    // Education sub-categories
    { id: generateId(), name: "Courses", type: "expense" as const, parentId: expenseParentCategories[7].id, color: "#4f46e5", isDefault: true },
    { id: generateId(), name: "Books", type: "expense" as const, parentId: expenseParentCategories[7].id, color: "#4338ca", isDefault: true },
  ]

  await db.insert(categories).values(subCategories)
  console.log("✅ Created sub-categories")

  // Create accounts
  await db.insert(accounts).values([
    {
      id: generateId(),
      name: "Cash",
      type: "cash",
      balance: 2500000,
      currency: "IDR",
      color: "#22c55e",
      isDefault: true,
    },
    {
      id: generateId(),
      name: "BCA Savings",
      type: "bank",
      balance: 15000000,
      currency: "IDR",
      institution: "Bank Central Asia",
      color: "#3b82f6",
      isDefault: true,
    },
    {
      id: generateId(),
      name: "Mandiri CC",
      type: "credit_card",
      balance: -3500000,
      currency: "IDR",
      institution: "Bank Mandiri",
      lastFourDigits: "1234",
      color: "#ef4444",
    },
  ])
  console.log("✅ Created accounts")

  // Create debts
  const today = new Date()
  const carLoanDue = new Date(today)
  carLoanDue.setFullYear(today.getFullYear() + 2)
  carLoanDue.setMonth(5)
  carLoanDue.setDate(15)

  const ccDue = new Date(today)
  ccDue.setFullYear(today.getFullYear() + 1)
  ccDue.setMonth(11)
  ccDue.setDate(31)

  const paylaterDue = new Date(today)
  paylaterDue.setFullYear(today.getFullYear() + 1)
  paylaterDue.setMonth(5)
  paylaterDue.setDate(30)

  await db.insert(debts).values([
    {
      id: generateId(),
      name: "Car Loan",
      type: "fixed_term",
      totalAmount: 150000000,
      remainingBalance: 98000000,
      monthlyInstallment: 4500000,
      dueDate: carLoanDue.toISOString().split("T")[0],
      startDate: "2023-06-15",
      color: "#3b82f6",
      notes: "Monthly installment due on 15th",
    },
    {
      id: generateId(),
      name: "Mandiri Credit Card",
      type: "revolving",
      totalAmount: 10000000,
      remainingBalance: 3500000,
      monthlyInstallment: 2000000,
      dueDate: ccDue.toISOString().split("T")[0],
      startDate: "2024-01-01",
      limit: 10000000,
      interestRate: 2.5,
      color: "#ef4444",
      notes: "Minimum payment due monthly",
    },
    {
      id: generateId(),
      name: "Home Paylater",
      type: "revolving",
      totalAmount: 5000000,
      remainingBalance: 2000000,
      monthlyInstallment: 500000,
      dueDate: paylaterDue.toISOString().split("T")[0],
      startDate: "2024-06-01",
      limit: 5000000,
      interestRate: 1.5,
      color: "#f59e0b",
      notes: "Pay off before due date to avoid interest",
    },
  ])
  console.log("✅ Created debts")

  // Create wallets for users
  if (husbandUser && wifeUser) {
    await db.insert(wallets).values([
      // Husband's wallets
      {
        id: generateId(),
        userId: husbandUser.id,
        name: "Husband Cash",
        type: "cash",
        balance: 1500000,
        currency: "IDR",
        color: "#3b82f6",
        icon: "wallet",
        isDefault: true,
      },
      {
        id: generateId(),
        userId: husbandUser.id,
        name: "Husband BCA",
        type: "bank",
        balance: 8000000,
        currency: "IDR",
        institution: "Bank Central Asia",
        color: "#3b82f6",
        icon: "building",
      },
      // Wife's wallets
      {
        id: generateId(),
        userId: wifeUser.id,
        name: "Wife Cash",
        type: "cash",
        balance: 1000000,
        currency: "IDR",
        color: "#ec4899",
        icon: "wallet",
        isDefault: true,
      },
      {
        id: generateId(),
        userId: wifeUser.id,
        name: "Wife Mandiri",
        type: "bank",
        balance: 7000000,
        currency: "IDR",
        institution: "Bank Mandiri",
        color: "#ec4899",
        icon: "building",
      },
    ])
    console.log("✅ Created wallets")
  }

  // Note: Streaks will be created automatically when users log their first transaction
  // No need to seed streaks here since we're not creating users directly

  console.log("🎉 Seeding completed successfully!")
  console.log("\n📊 Summary:")
  console.log(`   - Categories: ${incomeCategories.length + expenseParentCategories.length + subCategories.length}`)
  console.log(`   - Accounts: 3`)
  console.log(`   - Debts: 3`)
  console.log(`   - Wallets: 4 (2 per user)`)
  console.log(`\n👤 To create demo users, run: npm run db:create-demo-users`)
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
