// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Mock subscription endpoint
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { userId, planId, planName, price } = req.body;
    
    console.log('📦 Creating mock subscription:', {
      userId,
      planId, 
      planName,
      price
    });

    // Mock successful subscription response
    res.json({
      success: true,
      message: `Mock subscription created for ${planName} plan`,
      url: `/subscription/success?user_id=${userId}&plan=${planId}`,
      mock: true
    });
  } catch (error) {
    console.error('❌ Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription status
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      plan: user.subscription?.plan || 'basic',
      status: user.subscription?.status || 'inactive',
      currentPeriodEnd: user.subscription?.currentPeriodEnd
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;