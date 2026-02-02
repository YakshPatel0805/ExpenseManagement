# ExpenseTracker - React SPA

A modern expense tracking application built with React frontend and Express.js backend.

## Features

- 🔐 User authentication (signup/login)
- 📊 Dashboard with financial overview
- 💰 Expense tracking and categorization
- 👛 Multi-wallet support
- 📱 Responsive design
- 🔒 Secure session management
- ⚡ Single Page Application (SPA) behavior

## Tech Stack

### Frontend
- React 18
- React Router DOM v7
- Context API for state management
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

## Features Overview

### Authentication System
- Secure password hashing with bcrypt
- Session-based authentication
- Password strength validation
- Rate limiting for auth endpoints

### Dashboard
- Financial overview with key metrics
- Responsive sidebar navigation
- Mobile-friendly design
- Protected routes

### Expense Management
- Expense categorization
- Transaction history
- Visual spending breakdown

### Wallet Management
- Multiple account support
- Transaction tracking
- Account balance overview

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