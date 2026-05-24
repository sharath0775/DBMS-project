class ProfilePage {
  constructor() {
    this.init();
  }

  async init() {
    const theme = StorageManager.getTheme();
    if (theme === 'dark') document.documentElement.classList.add('dark');

    const token = StorageManager.getAuthToken();
    if (!token) {
      window.location.href = '/login.html';
      return;
    }

    await this.loadProfile();
    this.attachListeners();
  }

  async loadProfile() {
    try {
      const user = await api.getMe();
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('phone_number').value = user.phone || '';
      document.getElementById('address').value = user.address || '';
      document.getElementById('city').value = user.city || '';
      document.getElementById('state').value = user.state || '';
      document.getElementById('pincode').value = user.pincode || '';
      StorageManager.setUser(user);
    } catch (err) {
      console.error('Error loading profile:', err);
      Helpers.showToast('Unable to load profile', 'error');
    }
  }

  attachListeners() {
    document.getElementById('profile-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    try {
      const data = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone_number').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
      };

      Helpers.showLoader();
      const updatedUser = await api.updateProfile(data);
      Helpers.hideLoader();
      StorageManager.setUser(updatedUser);
      document.getElementById('profile-message').textContent = 'Profile updated successfully';
      setTimeout(() => {
        document.getElementById('profile-message').textContent = '';
      }, 3000);
    } catch (err) {
      Helpers.hideLoader();
      console.error('Profile update error:', err);
      Helpers.showToast(err.message || 'Unable to update profile', 'error');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProfilePage());
} else {
  new ProfilePage();
}
