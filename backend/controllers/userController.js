const User = require('../models/User');

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, isSubscribed } = req.body;
    const user = await User.create({ name, email, role, isSubscribed });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
