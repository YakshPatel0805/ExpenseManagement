# CSV Import Feature - User Guide

## Overview
The CSV Import feature allows you to bulk import your financial data (expenses or income) from CSV files and automatically visualize them in your expense tracker.

## How to Use

### 1. Access the Import Feature
- Navigate to the **Expenses** page
- Click the **📥 Import CSV** button in the top right corner

### 2. Download the Template (Optional)
- Click **📄 Download Template** to get a sample CSV file
- The template includes example data showing the correct format

### 3. Prepare Your CSV File

#### Required Columns:
- **date**: Transaction date (format: YYYY-MM-DD, e.g., 2024-01-15)
- **amount**: Transaction amount (positive number, e.g., 85.50)

#### Optional Columns:
- **title**: Description of the transaction (e.g., "Grocery Shopping")
- **category**: Expense category (food, shopping, housing, transportation, entertainment, healthcare, utilities, other)
- **description**: Additional notes about the transaction

#### Example CSV Format:
```csv
date,title,amount,category,description
2024-01-15,Grocery Shopping,85.50,food,Weekly groceries
2024-01-16,Gas Station,45.00,transportation,Fuel
2024-01-17,Netflix Subscription,15.99,entertainment,Monthly subscription
2024-01-18,Electric Bill,120.00,utilities,January bill
2024-01-19,Restaurant Dinner,65.00,food,Dinner with friends
```

### 4. Import Process

#### Step 1: Select CSV File
- Click **📁 Select CSV File**
- Choose your prepared CSV file
- The system will automatically preview the first 5 rows

#### Step 2: Select Account
- Choose which account/wallet the transactions should be added to
- This is the account that will be debited (for expenses) or credited (for income)

#### Step 3: Select Transaction Type
- **Expenses**: For money spent (default)
- **Income**: For money received

#### Step 4: Map Columns
The system will automatically detect common column names, but you can manually map:
- **📅 Date Column**: Which column contains the transaction date
- **💰 Amount Column**: Which column contains the amount
- **📝 Title Column**: Which column contains the transaction description
- **🏷️ Category Column**: Which column contains the category

#### Step 5: Review Preview
- Check the preview table to ensure data is correctly formatted
- Verify the column mapping is correct

#### Step 6: Import
- Click **📥 Import Transactions**
- Wait for the import to complete
- You'll see a success message with the number of imported transactions

## Features

### Automatic Category Detection
The system automatically maps categories based on keywords:
- **Food**: food, restaurant, grocery, dining, lunch, dinner, breakfast
- **Shopping**: shopping, retail, store, amazon, online
- **Housing**: rent, mortgage, housing, home, property
- **Transportation**: transport, gas, fuel, car, uber, taxi, parking
- **Entertainment**: entertainment, movie, game, fun, hobby, netflix
- **Healthcare**: health, medical, doctor, pharmacy, hospital
- **Utilities**: utility, electric, water, internet, phone, bill

### Data Validation
- Only rows with valid amounts (> 0) are imported
- Dates are validated and converted to proper format
- Missing required fields are handled gracefully

### Balance Updates
- Account balances are automatically updated
- Expenses decrease the balance
- Income increases the balance

### Transaction Logging
- All imported transactions are logged in the transaction history
- You can view them on the Wallets page under "Recent Transactions"

### Visualization
After import, your data is automatically visualized:
- **Dashboard**: Updated stats showing total spent, balance, transactions
- **Expense Page**: Bar chart showing expenses by category
- **Summary Page**: Detailed breakdown with date range filtering
- **Wallets Page**: Recent transaction list

## Tips for Best Results

1. **Clean Your Data**: Remove any header rows or summary rows from your CSV
2. **Consistent Dates**: Use YYYY-MM-DD format for dates
3. **Positive Numbers**: Use positive numbers for amounts (the system handles debits/credits)
4. **One Transaction Per Row**: Each row should represent a single transaction
5. **UTF-8 Encoding**: Save your CSV file with UTF-8 encoding to avoid character issues
6. **Test First**: Import a small sample first to verify the format

## Common CSV Sources

### Bank Statements
Most banks allow you to export transactions as CSV:
1. Log into your online banking
2. Navigate to transaction history
3. Look for "Export" or "Download" option
4. Select CSV format
5. Download and import into the expense tracker

### Credit Card Statements
Similar to bank statements:
1. Access your credit card account online
2. Find transaction history
3. Export as CSV
4. Import into the tracker

### Spreadsheet Applications
If you track expenses in Excel or Google Sheets:
1. Open your spreadsheet
2. Select File > Download > CSV
3. Import the CSV file

## Troubleshooting

### "No transactions provided" Error
- Ensure your CSV file has data rows (not just headers)
- Check that the file is properly formatted

### "Wallet not found" Error
- Make sure you've selected an account before importing
- Verify the account exists in your Accounts page

### "Invalid input data" Error
- Check that date format is correct (YYYY-MM-DD)
- Ensure amounts are positive numbers
- Verify required columns are mapped

### Some Transactions Failed
- Check the error details in the response
- Common issues: invalid dates, missing amounts, incorrect format
- Fix the problematic rows and re-import

## Data Privacy

- All imported data is stored securely in your account
- CSV files are processed in memory and not stored on the server
- Only you can access your imported transactions
- You can delete imported transactions individually if needed

## Example Use Cases

### 1. Migrating from Another App
Export your data from your old expense tracker and import it here to maintain your financial history.

### 2. Bulk Entry
Instead of manually entering dozens of transactions, prepare them in a spreadsheet and import all at once.

### 3. Bank Reconciliation
Download your bank statement and import it to automatically match your records with actual transactions.

### 4. Historical Data
Import past years' data to get comprehensive financial insights and trends.

## Support

If you encounter any issues with CSV import:
1. Check this guide for troubleshooting tips
2. Verify your CSV format matches the template
3. Try importing a smaller sample first
4. Contact support with the error message and sample data (remove sensitive information)
