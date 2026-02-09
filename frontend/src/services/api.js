// API service helper functions
const API_BASE = '';

class ApiService {
  // Generic request method
  static async request(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  static async login(email, password, remember = false) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, remember }),
    });
  }

  static async signup(name, email, password) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  static async logout() {
    return this.request('/logout', { method: 'POST' });
  }

  static async getAuthStatus() {
    return this.request('/api/auth/status');
  }

  // Profile methods
  static async updateProfile(profileData) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  static async changePassword(passwordData) {
    return this.request('/api/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Wallet methods
  static async getWallets() {
    return this.request('/api/wallets');
  }

  static async getWalletSummary() {
    return this.request('/api/wallets/summary');
  }

  static async createWallet(walletData) {
    return this.request('/api/wallets', {
      method: 'POST',
      body: JSON.stringify(walletData),
    });
  }

  static async updateWallet(walletId, walletData) {
    return this.request(`/api/wallets/${walletId}`, {
      method: 'PUT',
      body: JSON.stringify(walletData),
    });
  }

  static async deleteWallet(walletId) {
    return this.request(`/api/wallets/${walletId}`, {
      method: 'DELETE',
    });
  }

  static async transferMoney(transferData) {
    return this.request('/api/wallets/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  // Expense methods
  static async getExpenses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/expenses${queryParams ? `?${queryParams}` : ''}`);
  }

  static async getExpenseById(expenseId) {
    return this.request(`/api/expenses/${expenseId}`);
  }

  static async createExpense(expenseData) {
    return this.request('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  static async updateExpense(expenseId, expenseData) {
    return this.request(`/api/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  }

  static async deleteExpense(expenseId) {
    return this.request(`/api/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }

  static async getExpensesByCategory(category, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/expenses/category/${category}${queryParams ? `?${queryParams}` : ''}`);
  }

  static async getExpenseSummary(period = 'month') {
    return this.request(`/api/expenses/summary?period=${period}`);
  }

  // Transaction methods
  static async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/transactions${queryParams ? `?${queryParams}` : ''}`);
  }

  static async getTransactionById(transactionId) {
    return this.request(`/api/transactions/${transactionId}`);
  }

  // Category methods
  static async getCategories() {
    return this.request('/api/categories');
  }

  static async createCategory(categoryData) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  static async updateCategory(categoryId, categoryData) {
    return this.request(`/api/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  static async deleteCategory(categoryId) {
    return this.request(`/api/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Analytics methods
  static async getDashboardStats(period = 'month') {
    return this.request(`/api/analytics/dashboard?period=${period}`);
  }

  static async getSpendingTrends(period = '6months') {
    return this.request(`/api/analytics/trends?period=${period}`);
  }

  static async getCategoryBreakdown(period = 'month') {
    return this.request(`/api/analytics/categories?period=${period}`);
  }

  static async getMonthlyComparison() {
    return this.request('/api/analytics/monthly-comparison');
  }

  // Export methods
  static async exportExpenses(format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams({ format, ...filters }).toString();
    return this.request(`/api/export/expenses?${queryParams}`);
  }

  static async exportTransactions(format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams({ format, ...filters }).toString();
    return this.request(`/api/export/transactions?${queryParams}`);
  }
}

export default ApiService;