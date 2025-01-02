const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // Register new user
  register: async (req, res) => {
    const { email, password, role } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const newUser = new User({
        email,
        password,
        role: role || "user"
      });

      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({
        error: "Failed to register user",
        details: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

      const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "90d" }
      );

      res.status(200).json({ 
        message: "Login successful", 
        token, 
        role: user.role 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  },

  // Protected route handler
  getProtectedInfo: (req, res) => {
    res.status(200).json({ 
      message: "Access granted", 
      user: req.user 
    });
  }
};

module.exports = authController;

/*
Credentials for admin login
Mail: hemant@admin.com
Password: admin12345
*/