// routes/users.js - Add these routes
const express = require('express');
const router = express.Router();
const { createUser, getUserById, updateUserSubscription } = require('../controllers/userController');

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

module.exports = router;