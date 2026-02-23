# 🎉 UsFin - Shared Family Cashflow Tracker

A premium, feature-rich personal finance application built for families to manage their finances together.

![UsFin Banner](https://via.placeholder.com/1200x400/10b981/ffffff?text=UsFin+-+Shared+Family+Cashflow)

---

## ✨ Features

### 📊 Dashboard
- Real-time financial health score (A-F grade)
- Daily win-streak tracking with gamification
- Shared wallet balances (Husband & Wife)
- Income vs Expense tracking
- Debt progress visualization
- Category spending breakdown

### 💰 Transactions
- Add income, expense, transfer, and debt payments
- Search and advanced filtering
- Transaction categories with nested sub-categories
- Wallet-to-wallet transfers
- Transaction history with date grouping
- Edit and delete with balance reversal

### 🎯 Budgets & Goals
- Monthly budget limits per category
- Alert thresholds (80%, 90%, 100%)
- Savings goals with progress tracking
- Visual progress bars
- Goal completion celebrations

### 💳 Debt Management
- Track multiple debts (Car Loan, CC, Paylater)
- Auto-reduction on payment
- Payment history timeline
- Months remaining calculation
- Debt payoff progress visualization

### 🔄 Recurring Transactions
- Automated recurring transactions
- Daily, Weekly, Monthly, Yearly frequencies
- Toggle on/off anytime
- Next run date tracking
- Auto-creates transactions

### 📈 Reports & Analytics
- Income vs Expense charts
- Category breakdown (pie chart)
- Net worth trend over time
- Export to CSV
- 6-month financial overview

### 👤 Profile & Settings
- Dark/Light theme toggle
- Notification preferences
- Account management
- Quick stats overview
- Sign out

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Database:** SQLite (LibSQL via Turso)
- **ORM:** Drizzle ORM
- **Authentication:** BetterAuth
- **Server:** Next.js Server Actions

### DevOps
- **Hosting:** Vercel
- **Database:** Turso (Cloud LibSQL)
- **PWA:** next-pwa

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/usfin.git
cd usfin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:push

# Seed initial data
npm run db:seed

# Create demo users
npm run db:create-demo-users

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📝 Demo Accounts

After running `npm run db:create-demo-users`:

| User | Email | Password |
|------|-------|----------|
| Husband | husband@familyfin.com | password |
| Wife | wife@familyfin.com | password |

---

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data
npm run db:create-demo-users  # Create demo users
npm run db:studio    # Open Drizzle Studio

# Linting
npm run lint         # Run ESLint
```

---

## 📁 Project Structure

```
usfin/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── transactions/ # Transaction management
│   │   ├── budgets/      # Budget tracking
│   │   ├── goals/        # Savings goals
│   │   ├── categories/   # Category management
│   │   ├── debts/        # Debt tracking
│   │   ├── recurring/    # Recurring transactions
│   │   ├── reports/      # Analytics & reports
│   │   ├── profile/      # User profile
│   │   └── auth/         # Authentication pages
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── transactions/ # Transaction components
│   │   ├── shared/       # Shared components
│   │   └── ui/           # Shadcn UI components
│   ├── lib/              # Utilities & config
│   │   ├── db/           # Database schema & seed
│   │   ├── auth.ts       # BetterAuth config
│   │   └── utils.ts      # Helper functions
│   ├── contexts/         # React contexts
│   └── server/           # Server actions
│       └── actions/      # Backend logic
├── public/               # Static assets
├── .env.example          # Environment variables template
├── next.config.ts        # Next.js config
├── drizzle.config.ts     # Drizzle ORM config
└── package.json          # Dependencies
```

---

## 🗄️ Database Schema

### Tables

1. **users** - User accounts with roles
2. **wallets** - Separate balances per user
3. **transactions** - All financial transactions
4. **categories** - Nested income/expense categories
5. **debts** - Debt tracking (fixed & revolving)
6. **debt_payments** - Payment history
7. **budgets** - Monthly budget limits
8. **goals** - Savings goals
9. **streaks** - Gamification tracking
10. **activity_logs** - Shared activity feed
11. **recurring_transactions** - Auto-transactions

---

## 🌐 Deployment

### Deploy to Vercel + Turso

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guide.

**Quick Deploy:**

1. Push code to GitHub
2. Create Turso database
3. Deploy to Vercel with environment variables
4. Push schema to Turso
5. Seed initial data

---

## 🔐 Security

- Password hashing with bcrypt
- Session-based authentication
- Protected routes via middleware
- Environment variables for secrets
- SQL injection prevention (Drizzle ORM)

---

## 📊 Features in Detail

### Auto-Debt-Reduction
When you log a debt payment transaction, the system automatically:
- Reduces the debt remaining balance
- Records payment history
- Updates months remaining
- Logs activity for shared feed

### Gamification
- **Daily Streak:** Log transactions daily to maintain streak
- **Health Score:** A-F grade based on financial habits
- **Progress Tracking:** Visual progress bars for goals & debts

### Shared Access
- Both users can view all transactions
- Activity feed shows who added what
- Separate wallets with individual balances
- Shared financial health dashboard

---

## 🎨 UI/UX Features

- **Dark Mode First:** Premium dark theme (`#000000`)
- **Mobile-First:** Optimized for mobile devices
- **PWA Ready:** Install as native app
- **Animations:** Smooth Framer Motion transitions
- **Responsive:** Works on all screen sizes
- **Accessibility:** ARIA labels, keyboard navigation

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Database by [Turso](https://turso.tech/)
- Auth by [BetterAuth](https://better-auth.com/)

---

## 📞 Support

- **Documentation:** See this README
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues:** Open an issue on GitHub
- **Discussions:** GitHub Discussions

---

## 🎯 Roadmap

### Completed ✅
- Phase 1: Backend Foundation
- Phase 2: Budget & Goals
- Phase 3: Transaction Enhancements
- Phase 4: Category & Debt Management
- Phase 5: Recurring Transactions
- Phase 6: Profile & Settings
- Phase 7: Reports & Analytics

### Future 🚀
- Receipt photo uploads
- Push notifications
- Multi-currency support
- Bank integration (Plaid)
- Export to PDF
- Advanced analytics
- Mobile app (React Native)

---

Made with ❤️ for families managing finances together.
