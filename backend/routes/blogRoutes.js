const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/upload');

// Public routes
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlog);
router.get('/user/blogs/:authorId', blogController.getUserBlogs);

// Blog actions
router.post('/blogs', upload.array('media', 5), blogController.createBlog);
router.post('/blogs/:id/like', blogController.toggleLike);
router.post('/blogs/:id/comment', blogController.addComment);
router.delete('/blogs/:id/comment/:commentId', blogController.deleteComment);
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router;