const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserByUsername,
  getLikedVlogs,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validatePasswordConfirmation } = require('../middleware/validation');

// Create rate limiter for account deletion (strict limit)
const deleteAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per 15 minutes
  message: {
    success: false,
    error: {
      message: 'Too many deletion attempts. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (no authentication required)
router.get('/profile/:username', getUserByUsername);

// All routes below require authentication
router.use(protect);

// Liked vlogs route
router.get('/likes', getLikedVlogs);

// Bookmark routes
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/:vlogId', addBookmark);
router.delete('/bookmarks/:vlogId', removeBookmark);

// Follow routes
router.post('/:userId/follow', followUser);
router.delete('/:userId/follow', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

// SECURITY: Account deletion (requires password + rate limiting)
router.delete(
  '/me',
  deleteAccountLimiter,
  validatePasswordConfirmation,
  deleteAccount,
);

module.exports = router;
