# 💰 Expense Tracker - Full Stack Application

A modern, feature-rich expense tracking application built with React and Express.js. Track your expenses, manage multiple accounts, visualize spending patterns, and take control of your finances.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration and login
- Password hashing with bcrypt
- Session-based authentication
- Protected routes and API endpoints
- Rate limiting to prevent abuse
- Helmet.js security headers

### 📊 Dashboard & Analytics
- Real-time financial overview
- Key metrics display (total spent, balance, transactions, budget usage)
- Interactive spending charts with Chart.js
- Budget progress tracking with color-coded indicators
- Custom date range filtering (This Month, Last 3 Months, This Year, Custom Range)
- Responsive design for all devices

### 💸 Expense Management
- Add, edit, and delete expenses
- 8 expense categories with emoji icons:
  - 🍔 Food & Dining
  - 🚗 Transportation
  - 🏠 Housing
  - 🎬 Entertainment
  - 🏥 Healthcare
  - 🛒 Shopping
  - 💼 Business
  - 📚 Education
- Transaction history with filtering
- Visual spending breakdown by category
- CSV bulk import for expenses

### 💵 Income Tracking
- Track multiple income sources
- Income vs expense comparison
- Income summary and statistics
- CSV bulk import for income data

### 👛 Multi-Wallet/Account Support
- Manage multiple accounts:
  - 💳 Credit Card
  - 💳 Debit Card
  - 🏦 Savings
  - 🏦 Checking
  - 💵 Cash
  - 📈 Investment
  - 👛 Other
- Customizable account colors and icons
- Real-time balance tracking
- Transfer money between accounts
- Transaction history per account

### 📥 CSV Import Feature
- Bulk import expenses and income from CSV files
- Auto-detection of column names and categories
- Downloadable CSV template
- Flexible column mapping
- Data validation (dates, amounts, categories)
- Automatic balance updates
- Instant visualiza
   ```

5. **Start the application**
first create .env file and write connections:

MONGO_URL=''
SESSION_SECRET=''

### Development Mode

To run in development mode with hot reloading:

1. **Start the backend server**
   ```bash
   npm run dev
   ```

2. **In a new terminal, start the React development server**
   ```bash
   cd frontend
   npm start
   ```

   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:3001` (with proxy to backend)

## Project Structure

```
expense-tracker/
├── server/
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   ├── Transaction.js
│   │   └── Wallet.js
│   ├── routes/              # API routes
│   │   ├── userRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── walletRoutes.js
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── server.js            # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   └── CSVImport.jsx
│   │   ├── context/         # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── expense.jsx
│   │   │   ├── accounts.jsx
│   │   │   ├── wallets.jsx
│   │   │   ├── summary.jsx
│   │   │   └── settings.jsx
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── global.css
│   └── package.json
├── .env                     # Environment variables
├── .gitignore
├── package.json             # Root package.json
├── README.md
└── TESTING_GUIDE.md
```

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /api/auth/status` - Check authentication status

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/summary` - Get expense summary by category
- `POST /api/expenses` - Create new expense
- `POST /api/expenses/bulk` - Bulk import expenses from CSV
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/income` - Get all income
- `GET /api/income/summary` - Get income summary
- `POST /api/income` - Create new income
- `POST /api/income/bulk` - Bulk import income from CSV
- `DELETE /api/income/:id` - Delete income

### Wallets/Accounts
- `GET /api/wallets` - Get all wallets
- `GET /api/wallets/summary` - Get wallet summary
- `POST /api/wallets` - Create new wallet
- `POST /api/wallets/transfer` - Transfer money between wallets
- `PUT /api/wallets/:id` - Update wallet
- `DELETE /api/wallets/:id` - Delete wallet

### Transactions
- `GET /api/transactions/recent` - Get recent transactions
- `GET /api/transactions/stats` - Get transaction statistics

## Features Overview

### CSV Import Feature 📥
Import your financial data from CSV files:
- **Bulk Import**: Import hundreds of transactions at once
- **Auto-Detection**: Automatically detects column names and categories
- **Template Download**: Get a sample CSV template to start
- **Flexible Mapping**: Map any CSV columns to transaction fields
- **Data Validation**: Validates dates, amounts, and categories
- **Balance Updates**: Automatically updates account balances
- **Visualization**: Imported data appears immediately in charts and reports

See [CSV_IMPORT_GUIDE.md](./CSV_IMPORT_GUIDE.md) for detailed instructions.

### Authentication System
- Secure password hashing with bcrypt
- Session-based authentication
- Password strength validation
- Rate limiting for auth endpoints

### Dashboard
- Financial overview with key metrics
- Real-time stats (total spent, balance, transactions, budget usage)
- Spending visualization with charts
- Budget progress bar with color coding
- Responsive sidebar navigation
- Mobile-friendly design
- Protected routes
- Quick action buttons

### Expense Management
- Add/edit/delete expenses
- 8 expense categories with emoji icons
- Expense categorization and tracking
- Transaction history with filtering
- Visual spending breakdown by category
- CSV bulk import
- Real-time balance updates

### Income Management
- Add/track income sources
- Income vs expense comparison
- Income summary and statistics
- CSV bulk import for income data

### Wallet/Account Management
- Multiple account support (savings, credit card, debit card, cash, investment)
- Account customization with colors
- Transaction tracking across accounts
- Account balance overview
- Transfer money between accounts
- Recent transaction history

### Reports & Analytics
- Summary page with custom date range picker
- Expense breakdown by category
- Income and expense comparison
- Net balance calculation
- Transaction statistics
- Bar and line charts
- Budget tracking

## Security Features

- Helmet.js for security headers
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure session management
- HTTPS-only cookies in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
