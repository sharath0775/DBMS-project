const { User } = require('../models');
const { comparePassword } = require('../utils/hash');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

class AuthService {
  async register(email, password, name) {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user (password hashed by User model hook)
    const user = await User.create({
      email,
      password,
      name,
      role: 'user'
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  async refreshToken(refreshToken) {
    const { verifyRefreshToken } = require('../utils/jwt');
    
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      const newToken = generateToken(user);
      return { token: newToken };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    return user;
  }

  async updateUser(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update(data);
    return user;
  }
}

module.exports = new AuthService();
