const express = require('express');
const router = express.Router();
const { createUser, getUserById } = require('../controllers/userController');
const User = require('../models/User');

router.post('/', createUser);
router.get('/:id', getUserById);

// ADD THIS NEW ROUTE FOR CHAT USERS
router.get('/chat/users', async (req, res) => {
  try {
    // Fetch all users from database
    const users = await User.find()
      .select('name email role createdAt domain isSubscribed')
      .sort({ name: 1 });

    // Transform data for frontend
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