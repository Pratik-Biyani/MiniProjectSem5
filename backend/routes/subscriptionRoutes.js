// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();

// Mock subscription route
router.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('📦 Subscription request received:', req.body);
    
    const { userId, planId, planName, price } = req.body;

    // Validate required fields
    if (!userId || !planId || !planName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, planId, planName'
      });
    }

    // Mock successful response
    res.json({
      success: true,
      message: `Mock subscription created for ${planName} plan`,
      data: {
        sessionId: `mock_session_${Date.now()}`,
        url: `/subscription/success?user_id=${userId}&plan=${planId}`,
        planName,
        price: price || 0
      },
      mock: true
    });
    
  } catch (error) {
    console.error('❌ Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message
    });
  }
});

// Get available plans
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: {
      plans: [
        { id: 'basic', name: 'Basic', price: 0, features: ['Feature 1', 'Feature 2'] },
        { id: 'premium', name: 'Premium', price: 29, features: ['All Basic features', 'Premium Feature 1'] },
        { id: 'enterprise', name: 'Enterprise', price: 99, features: ['All Premium features', 'Enterprise Support'] }
      ]
    }
  });
});

module.exports = router;