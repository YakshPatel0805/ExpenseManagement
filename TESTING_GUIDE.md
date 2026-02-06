# Complete Testing Guide - Expense Tracker

## 🎯 Prerequisites

Before testing, ensure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB installed and running
- ✅ All dependencies installed

---

## 📋 Step 1: Install Dependencies

### Backend Dependencies
```bash
# In the root directory
npm install
```

### Frontend Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 🗄️ Step 2: Start MongoDB

### Option A: MongoDB Running Locally
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"

# Mac/Linux
sudo systemctl start mongod
# Or
mongod --dbpath /data/db
```

### Option B: Use MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env` file:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

### Verify MongoDB is Running
```bash
# Try connecting
mongosh
# Or
mongo

# You should see MongoDB shell
# Type 'exit' to quit
```

---

## 🏗️ Step 3: Build Frontend

```bash
# Build the React app
npm run build
```

This creates the `frontend/build` folder with production-ready files.

---

## 🚀 Step 4: Start the Application

### Method 1: Production Mode (Recommended for Testing)
```bash
# Start the server (serves built React app)
npm start
```

The app will be available at: **http://localhost:3000**

### Method 2: Development Mode (Hot Reload)
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend dev server
npm run dev-frontend
```

- Backend: http://localhost:3000
- Frontend: http://localhost:3001 (with hot reload)

---

## 🧪 Step 5: Manual Testing Checklist

### Test 1: User Authentication ✅

**Signup:**
1. Open http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@1234
4. Click "Sign Up"
5. ✅ Should see success message
6. ✅ Should redirect to login

**Login:**
1. Enter email: test@example.com
2. Enter password: Test@1234
3. Click "Login"
4. ✅ Should redirect to dashboard
5. ✅ Should see your name in sidebar

**Logout:**
1. Click "Logout" in sidebar
2. ✅ Should redirect to home page
3. ✅ Cannot access dashboard without login

---

### Test 2: Account Management ✅

**Add Account:**
1. Login to dashboard
2. Click "Accounts" in sidebar
3. Click "+ Add Account"
4. Fill in:
   - Account Name: Main Checking
   - Account Type: Savings Account
   - Current Balance: 5000
   - Bank Name: Test Bank
   - Account Number: 1234567890
5. Click "Add Account"
6. ✅ Should see success message
7. ✅ Account appears in list

**Add More Accounts:**
1. Add "Credit Card" with balance: 2000
2. Add "Savings" with balance: 10000
3. ✅ Should see 3 accounts total

**Edit Account:**
1. Click edit button (✏️) on any account
2. Change balance to 5500
3. Click "Update Account"
4. ✅ Balance should update

**Delete Account:**
1. Click delete button (🗑️)
2. Confirm deletion
3. ✅ Account should be removed

---

### Test 3: Expense Tracking ✅

**Add Expense:**
1. Click "Expenses" in sidebar
2. Click "+ Add Expense"
3. Fill in:
   - Title: Grocery Shopping
   - Amount: 150.50
   - Category: Food & Drinks
   - Account: Main Checking
   - Date: Today
   - Description: Weekly groceries
4. Click "Add Expense"
5. ✅ Success message appears
6. ✅ Expense appears in list
7. ✅ Account balance decreases

**Add Multiple Expenses:**
1. Add "Gas Station" - $45 - Transportation
2. Add "Netflix" - $15.99 - Entertainment
3. Add "Electric Bill" - $120 - Utilities
4. ✅ All expenses appear
5. ✅ Chart updates with categories

**Delete Expense:**
1. Click delete button (🗑️) on any expense
2. Confirm deletion
3. ✅ Expense removed
4. ✅ Account balance restored

---

### Test 4: Income Tracking ✅

**Add Income:**
1. On Expenses page, click "💵 Add Income"
2. Fill in:
   - Income Title: Monthly Salary
   - Amount: 5000
   - Account: Main Checking
   - Date: Today
   - Description: January salary
3. Click "Add Income"
4. ✅ Success message
5. ✅ Account balance increases

**Add More Income:**
1. Add "Freelance Work" - $1200
2. ✅ Both income records visible

---

### Test 5: Money Transfer ✅

**Transfer Between Accounts:**
1. Click "Wallets" in sidebar
2. Click "💸 Transfer Money"
3. Fill in:
   - From Account: Main Checking
   - To Account: Savings
   - Amount: 500
   - Description: Monthly savings
4. Click "Transfer Money"
5. ✅ Success message
6. ✅ Source account balance decreases
7. ✅ Destination account balance increases
8. ✅ Transaction appears in "Recent Transactions"

---

### Test 6: CSV Import ✅

**Prepare Test CSV:**
Create a file `test-expenses.csv`:
```csv
date,title,amount,category,description
2024-01-15,Grocery Shopping,85.50,food,Weekly groceries
2024-01-16,Gas Station,45.00,transportation,Fuel
2024-01-17,Netflix Subscription,15.99,entertainment,Monthly subscription
2024-01-18,Electric Bill,120.00,utilities,January bill
2024-01-19,Restaurant Dinner,65.00,food,Dinner with friends
```

**Import CSV:**
1. Go to Expenses page
2. Click "📥 Import CSV"
3. Click "📄 Download Template" (optional)
4. Click "📁 Select CSV File"
5. Choose your `test-expenses.csv`
6. ✅ Preview shows 5 rows
7. Select Account: Main Checking
8. Select Type: Expenses
9. Verify column mapping:
   - Date Column: date
   - Amount Column: amount
   - Title Column: title
   - Category Column: category
10. Click "📥 Import Transactions"
11. ✅ Success message: "Successfully imported 5 transactions!"
12. ✅ All 5 expenses appear in list
13. ✅ Account balance updated
14. ✅ Chart shows new data

---

### Test 7: Dashboard ✅

**Check Dashboard Stats:**
1. Click "Dashboard" in sidebar
2. ✅ Total Spent shows correct amount
3. ✅ Total Balance shows sum of all accounts
4. ✅ Transactions count is correct
5. ✅ Budget usage percentage displays
6. ✅ Chart shows expense breakdown
7. Click "🔄 Refresh"
8. ✅ All stats update

---

### Test 8: Summary Page ✅

**Test Date Filters:**
1. Click "Summary" in sidebar
2. ✅ Default shows "This Month"
3. Change to "Last 3 Months"
4. ✅ Data updates automatically
5. Change to "Custom Range"
6. ✅ Date pickers appear
7. Select date range
8. ✅ Data filters correctly
9. ✅ Income card shows total income
10. ✅ Expenses card shows total expenses
11. ✅ Net Amount shows difference
12. ✅ Chart displays category breakdown
13. Click "🔄 Refresh"
14. ✅ Data reloads

---

### Test 9: Data Export ✅

**Export All Data:**
1. Click "Settings" in sidebar
2. Scroll to "Data & Privacy"
3. Click "Export" button
4. ✅ 4 files download:
   - expense-tracker-export-YYYY-MM-DD.json
   - expenses-YYYY-MM-DD.csv
   - income-YYYY-MM-DD.csv
   - transactions-YYYY-MM-DD.csv
5. Open CSV files in Excel
6. ✅ Data is properly formatted
7. Open JSON file
8. ✅ Contains all data

---

### Test 10: Settings ✅

**Update Profile:**
1. In Settings, click "Edit" on Profile
2. Change name to "Updated Name"
3. Click "Update Profile"
4. ✅ Success message
5. ✅ Name updates in sidebar

**Change Password:**
1. Click "Change" on Password
2. Enter:
   - Current Password: Test@1234
   - New Password: NewTest@1234
   - Confirm: NewTest@1234
3. Click "Change Password"
4. ✅ Success message
5. Logout and login with new password
6. ✅ Login works

**Change Settings:**
1. Change Currency to EUR
2. Toggle Notifications
3. ✅ Settings save

---

### Test 11: Delete Account ⚠️

**WARNING: This will delete all data!**

1. In Settings, scroll to "Data & Privacy"
2. Click "Delete" button
3. ✅ First warning appears
4. Click "OK"
5. ✅ Type confirmation prompt appears
6. Type: DELETE MY ACCOUNT
7. Click "OK"
8. ✅ Final warning appears
9. Click "OK"
10. ✅ Success message
11. ✅ Redirected to home page
12. Try to login
13. ✅ Login fails (account deleted)

---

## 🔍 Step 6: Check Database

### View Data in MongoDB

```bash
# Connect to MongoDB
mongosh
# Or
mongo

# Switch to database
use Node-JS-users

# View collections
show collections

# View users
db.users.find().pretty()

# View expenses
db.expenses.find().pretty()

# View wallets
db.wallets.find().pretty()

# View transactions
db.transactions.find().pretty()

# Count documents
db.expenses.countDocuments()
db.wallets.countDocuments()

# Exit
exit
```

---

## 🐛 Step 7: Check for Errors

### Monitor Console Logs

**Backend Console:**
- Watch for errors in terminal where you ran `npm start`
- Should see: "MongoDB Connected..." and "Server Started on http://localhost:3000"

**Browser Console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

**Common Issues:**

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill process on port 3000 or change port

**Session Secret Error:**
```
ERROR: SESSION_SECRET environment variable is required
```
**Solution:** Check .env file exists and has SESSION_SECRET

---

## 📊 Step 8: Performance Testing

### Test with Large Data

**Import Large CSV:**
1. Create CSV with 100+ transactions
2. Import via CSV Import feature
3. ✅ Check import speed
4. ✅ Verify all data imported
5. ✅ Check charts render correctly

**Test Pagination:**
1. Add 50+ expenses
2. Check if pagination works
3. ✅ Data loads smoothly

---

## 🔒 Step 9: Security Testing

**Test Authentication:**
1. Try accessing /dashboard without login
2. ✅ Should redirect to login
3. Try accessing API endpoints without session
4. ✅ Should return 401 Unauthorized

**Test Input Validation:**
1. Try creating expense with negative amount
2. ✅ Should show error
3. Try SQL injection in inputs
4. ✅ Should be sanitized

**Test Password Requirements:**
1. Try weak password: "123456"
2. ✅ Should reject
3. Try strong password: "Test@1234"
4. ✅ Should accept

---

## 📱 Step 10: Responsive Testing

**Test on Different Screen Sizes:**

1. Desktop (1920x1080)
   - ✅ Sidebar visible
   - ✅ Charts display properly
   - ✅ Forms are readable

2. Tablet (768px)
   - ✅ Layout adjusts
   - ✅ Sidebar collapses
   - ✅ Touch-friendly buttons

3. Mobile (375px)
   - ✅ Mobile menu works
   - ✅ Forms stack vertically
   - ✅ Charts are scrollable

**Browser DevTools:**
- Press F12
- Click device toolbar icon
- Test different devices

---

## ✅ Final Checklist

Before considering testing complete:

- [ ] All features work without errors
- [ ] Data persists after page refresh
- [ ] Charts display correctly
- [ ] CSV import/export works
- [ ] All forms validate properly
- [ ] Authentication works
- [ ] Database stores data correctly
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] All buttons are clickable
- [ ] Loading states appear
- [ ] Success/error messages show

---

## 🚨 Troubleshooting

### Application Won't Start

**Check Node.js:**
```bash
node --version
# Should be v14 or higher
```

**Check MongoDB:**
```bash
mongosh --version
# Should show version
```

**Reinstall Dependencies:**
```bash
rm -rf node_modules
rm -rf frontend/node_modules
npm install
cd frontend && npm install
```

### Data Not Saving

**Check MongoDB Connection:**
- Verify MongoDB is running
- Check MONGO_URL in .env
- Check console for connection errors

### Charts Not Displaying

**Check Chart.js:**
```bash
cd frontend
npm list chart.js react-chartjs-2
# Should show installed versions
```

### CSV Import Not Working

**Check PapaParse:**
```bash
cd frontend
npm list papaparse
# Should show installed version
```

---

## 📞 Need Help?

If you encounter issues:

1. Check console logs (backend and browser)
2. Verify all dependencies installed
3. Ensure MongoDB is running
4. Check .env file configuration
5. Try rebuilding: `npm run build`
6. Clear browser cache
7. Try different browser

---

## 🎉 Success Criteria

Your testing is successful when:

✅ You can signup and login
✅ You can add/edit/delete accounts
✅ You can track expenses and income
✅ You can transfer money
✅ You can import CSV data
✅ You can export all data
✅ Dashboard shows real-time stats
✅ Summary page filters work
✅ All charts display correctly
✅ No errors in console
✅ Data persists in database

---

*Happy Testing! 🚀*
