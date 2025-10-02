// routes/users.js
const express = require('express');
const router = express.Router();
const { createUser, getUserById, updateUserSubscription } = require('../controllers/userController');
const User = require('../models/User');

// Existing routes
router.post('/', createUser);
router.get('/:id', getUserById);

// Add subscription update route
router.put('/:id/subscription', updateUserSubscription);

// Add mock subscription route
router.post('/subscriptions/create-checkout-session', async (req, res) => {
  try {
    const { userId, planId, planName, price } = req.body;

    // Mock successful response
    res.json({
      success: true,
      message: `Mock subscription created for ${planName} plan`,
      url: `/subscription/success?user_id=${userId}&plan=${planId}`,
      mock: true // Indicate this is a mock response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADD THIS NEW ROUTE FOR CHAT USERS (fixed)
router.get('/chat/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role createdAt domain isSubscribed')
      .sort({ name: 1 });

    const transformedUsers = users.map(user => ({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      domain: user.domain,
      isSubscribed: user.isSubscribed,
      createdAt: user.createdAt
    }));

    res.json({
      success: true,
      data: {
        users: transformedUsers
      }
    });
  } catch (error) {
    console.error('Error fetching users for chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

module.exports = router;
