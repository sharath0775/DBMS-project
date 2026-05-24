const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await authService.register(email, password, name);
      return res.status(201).json({
        message: 'Registration successful',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await authService.login(email, password);
      return res.status(200).json({
        message: 'Login successful',
        data: result
      });
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.id);
      return res.status(200).json({
        message: 'User retrieved',
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          pincode: user.pincode
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, phone, address, city, state, pincode } = req.body;
      
      const user = await authService.updateUser(req.user.id, {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined
      });

      return res.status(200).json({
        message: 'Profile updated',
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  logout(req, res) {
    return res.status(200).json({
      message: 'Logout successful'
    });
  }
}

module.exports = new AuthController();
