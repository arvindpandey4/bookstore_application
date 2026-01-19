const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
    registerUser,
    loginUser,
    googleCallback,
    updateProfile,
    getUserProfile,
    forgotPassword,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/profile', protect, updateProfile);
router.get('/profile', protect, getUserProfile);

// Google Auth
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;
