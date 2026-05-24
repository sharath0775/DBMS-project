// Login Page Logic
class LoginPage {
  constructor() {
    this.init();
  }

  init() {
    // Apply theme
    const theme = StorageManager.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Check if already logged in
    if (StorageManager.getAuthToken()) {
      window.location.href = '/';
      return;
    }

    document.getElementById('login-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        this.showError('Please fill in all fields');
        return;
      }

      Helpers.showLoader();
      const result = await api.login(email, password);
      Helpers.hideLoader();

      // Store token and user data
      api.setToken(result.token);
      StorageManager.setUser(result.user);

      Helpers.showToast('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      Helpers.hideLoader();
      this.showError(err.message || 'Login failed');
    }
  }

  showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 5000);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LoginPage());
} else {
  new LoginPage();
}
