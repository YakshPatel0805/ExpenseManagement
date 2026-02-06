# ExpenseTracker - React SPA

A modern expense tracking application built with React frontend and Express.js backend.

## Features

- 🔐 User authentication (signup/login)
- 📊 Dashboard with financial overview
- 💰 Expense tracking and categorization
- 💵 Income tracking and management
- 👛 Multi-wallet/account support
- 💸 Money transfer between accounts
- 📥 **CSV Import** - Bulk import expenses/income from CSV files
- 📈 Data visualization with charts (Chart.js)
- 📅 Custom date range filtering
- 🎯 Budget tracking with progress indicators
- 📱 Responsive design
- 🔒 Secure session management
- ⚡ Single Page Application (SPA) behavior

## Tech Stack

### Frontend
- React 18
- React Router DOM v7
- Context API for state management
- Chart.js + react-chartjs-2 for data visualization
- PapaParse for CSV parsing
- CSS3 with responsive design

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- bcrypt for password hashing
- express-session for authentication
- Helmet for security
- Rate limiting

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   SESSION_SECRET=your-super-secret-session-key-here-change-this-in-production
   MONGO_URL=mongodb://localhost:27017/expense-tracker
   NODE_ENV=development
   ```

4. **Build the React frontend**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

### Development Mode

To run in development mode with hot reloading:

1. **Start the backend server**
   ```bash
   npm run dev
   ```

2. **In a new terminal, start the React development server**
   ```bash
   npm run dev-frontend
   ```

   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:3001` (with proxy to backend)

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   └── User.js
│   └── routes/
│       └── userRoutes.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── index.jsx
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── expense.jsx
│   │   │   └── wallets.jsx
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
├── app.js
├── package.json
└── .env
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