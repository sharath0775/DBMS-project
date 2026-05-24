// Register Page Logic
class RegisterPage {
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

    document.getElementById('register-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    try {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (!name || !email || !password || !confirmPassword) {
        this.showError('Please fill in all fields');
        return;
      }

      if (password.length < 6) {
        this.showError('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        this.showError('Passwords do not match');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.showError('Please enter a valid email');
        return;
      }

      Helpers.showLoader();
      const result = await api.register(email, password, name);
      Helpers.hideLoader();

      // Store token and user data
      api.setToken(result.token);
      StorageManager.setUser(result.user);

      Helpers.showToast('Registration successful!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      Helpers.hideLoader();
      this.showError(err.message || 'Registration failed');
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
  document.addEventListener('DOMContentLoaded', () => new RegisterPage());
} else {
  new RegisterPage();
}
