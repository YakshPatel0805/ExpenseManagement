# Data Export Feature - User Guide

## Overview
The Data Export feature allows you to download all your financial data in multiple formats (JSON and CSV) for backup, analysis, or migration purposes.

## How to Export Your Data

### Step 1: Navigate to Settings
1. Click on **Settings** in the sidebar navigation
2. Scroll down to the **Data & Privacy** section
3. Find the **Export Data** option

### Step 2: Click Export Button
1. Click the **Export** button
2. The system will fetch all your data from the server
3. Multiple files will be downloaded automatically

### Step 3: Check Your Downloads
You will receive **4 files**:

1. **expense-tracker-export-YYYY-MM-DD.json** - Complete data backup in JSON format
2. **expenses-YYYY-MM-DD.csv** - All expenses in CSV format
3. **income-YYYY-MM-DD.csv** - All income records in CSV format
4. **transactions-YYYY-MM-DD.csv** - All transactions in CSV format

## File Formats

### 1. JSON Export (Complete Backup)

**Filename:** `expense-tracker-export-2024-02-06.json`

**Contains:**
- Export date and timestamp
- User information (name, email)
- All expenses with full details
- All income records
- All wallets/accounts
- All transactions

**Structure:**
```json
{
  "exportDate": "2024-02-06T10:30:00.000Z",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "expenses": [...],
  "income": [...],
  "wallets": [...],
  "transactions": [...]
}
```

**Use Cases:**
- Complete backup of all data
- Migration to another system
- Data analysis with programming tools
- Archive for long-term storage

### 2. Expenses CSV

**Filename:** `expenses-2024-02-06.csv`

**Columns:**
- Date
- Title
- Amount
- Category
- Description
- Account

**Example:**
```csv
Date,Title,Amount,Category,Description,Account
2024-01-15,Grocery Shopping,85.50,food,Weekly groceries,Main Checking
2024-01-16,Gas Station,45.00,transportation,Fuel,Credit Card
```

**Use Cases:**
- Import into Excel or Google Sheets
- Create custom reports
- Tax preparation
- Budget analysis

### 3. Income CSV

**Filename:** `income-2024-02-06.csv`

**Columns:**
- Date
- Title
- Amount
- Description
- Account

**Example:**
```csv
Date,Title,Amount,Description,Account
2024-01-01,Salary,5000.00,Monthly salary,Main Checking
2024-01-15,Freelance Work,1200.00,Project payment,Savings
```

**Use Cases:**
- Income tracking and analysis
- Tax reporting
- Financial planning
- Income verification

### 4. Transactions CSV

**Filename:** `transactions-2024-02-06.csv`

**Columns:**
- Date
- Type
- Amount
- Description

**Example:**
```csv
Date,Type,Amount,Description
2024-01-15,expense,85.50,Grocery Shopping
2024-01-16,transfer,500.00,Transfer from Main Checking to Savings
2024-01-20,income,5000.00,Salary
```

**Use Cases:**
- Complete transaction history
- Account reconciliation
- Audit trail
- Financial review

## Features

### Automatic Date Formatting
- All dates are exported in YYYY-MM-DD format
- Consistent across all export formats
- Easy to sort and filter

### Data Integrity
- All data is fetched directly from the database
- No data loss or corruption
- Includes all historical records

### CSV Compatibility
- Properly escaped commas and quotes
- UTF-8 encoding for international characters
- Compatible with Excel, Google Sheets, Numbers

### Privacy & Security
- Export happens client-side (in your browser)
- No data sent to external servers
- Files saved directly to your device

## Use Cases

### 1. Regular Backups
**Frequency:** Monthly or quarterly
**Purpose:** Protect against data loss
**Action:** Export and save to cloud storage or external drive

### 2. Tax Preparation
**Frequency:** Annually
**Purpose:** Provide records to accountant
**Action:** Export all data at year-end, share CSV files

### 3. Financial Analysis
**Frequency:** As needed
**Purpose:** Analyze spending patterns
**Action:** Export to Excel, create pivot tables and charts

### 4. Migration
**Frequency:** One-time
**Purpose:** Move to another expense tracker
**Action:** Export JSON for complete data, CSV for compatibility

### 5. Sharing with Financial Advisor
**Frequency:** As needed
**Purpose:** Financial planning consultation
**Action:** Export CSV files, remove sensitive information

### 6. Legal/Audit Requirements
**Frequency:** As required
**Purpose:** Provide financial records
**Action:** Export all data with timestamps

## Tips for Using Exported Data

### Excel/Google Sheets
1. Open the CSV file
2. Data will automatically populate in columns
3. Use filters and pivot tables for analysis
4. Create charts for visualization

### Data Analysis
1. Use the JSON export for programming
2. Python, JavaScript, or R can parse JSON easily
3. Perform statistical analysis
4. Create custom visualizations

### Backup Strategy
1. Export monthly
2. Save to multiple locations:
   - Cloud storage (Google Drive, Dropbox)
   - External hard drive
   - USB flash drive
3. Keep at least 3 months of backups

### Privacy Protection
Before sharing exported files:
1. Remove sensitive account numbers
2. Redact personal information
3. Consider aggregating data by category
4. Use password-protected ZIP files

## Troubleshooting

### Export Button Not Working
**Solution:**
- Check your internet connection
- Ensure you're logged in
- Try refreshing the page
- Clear browser cache

### Files Not Downloading
**Solution:**
- Check browser download settings
- Allow pop-ups for the site
- Check available disk space
- Try a different browser

### CSV Opens Incorrectly in Excel
**Solution:**
- Use "Import Data" instead of double-clicking
- Select "Delimited" and "Comma" as separator
- Ensure UTF-8 encoding is selected

### Missing Data in Export
**Solution:**
- Ensure all data is synced
- Refresh the page before exporting
- Check if filters are applied
- Contact support if data is truly missing

## Data Format Details

### Date Format
- **Format:** YYYY-MM-DD (ISO 8601)
- **Example:** 2024-02-06
- **Timezone:** UTC

### Amount Format
- **Format:** Decimal number
- **Example:** 1234.56
- **Currency:** Not included (assumed from settings)

### Text Fields
- **Encoding:** UTF-8
- **Escaping:** Commas and quotes properly escaped
- **Line breaks:** Preserved in JSON, removed in CSV

## Security & Privacy

### What's Included
✅ Transaction data (expenses, income)
✅ Account information (names, types, balances)
✅ Categories and descriptions
✅ Dates and amounts

### What's NOT Included
❌ Passwords
❌ Session tokens
❌ API keys
❌ Other users' data

### Best Practices
1. **Store Securely:** Keep exports in encrypted storage
2. **Delete Old Exports:** Remove outdated backup files
3. **Share Carefully:** Redact sensitive info before sharing
4. **Use Strong Passwords:** If compressing exports, use strong passwords

## Re-importing Data

### To This Application
Currently, you can:
- Use CSV Import feature for expenses and income
- Import one file at a time
- Map columns during import

### To Other Applications
Most financial apps support CSV import:
1. Check the target app's import format
2. Match column names if needed
3. Convert dates if required
4. Import in batches if large dataset

## Automation (Advanced)

### Scheduled Exports
While not built-in, you can:
1. Set a calendar reminder
2. Export manually on schedule
3. Save to automated backup location

### API Access (Future)
Future versions may include:
- API endpoint for automated exports
- Scheduled export feature
- Direct cloud storage integration

## Support

### Need Help?
- Check this guide first
- Review the FAQ section
- Contact support with:
  - Error messages
  - Browser and OS version
  - Steps to reproduce issue

### Feature Requests
Want additional export features?
- Different file formats (PDF, XML)
- Filtered exports (date range, category)
- Scheduled automatic exports
- Direct cloud storage integration

Submit feedback through the Settings page!

---

## Quick Reference

**Export Location:** Settings → Data & Privacy → Export Data

**File Types:** JSON (complete), CSV (expenses, income, transactions)

**Frequency:** As needed, recommended monthly

**Use For:** Backup, analysis, tax prep, migration

**Privacy:** All data stays on your device

---

*Last Updated: February 6, 2026*
