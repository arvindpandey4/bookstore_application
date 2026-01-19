const userService = require('../services/user.service');

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// @desc    Auth user & get token
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

// @desc    Google OAuth Callback
// @route   GET /auth/google/callback
// @access  Public
const googleCallback = (req, res) => {
    // passport attaches user to req.user
    const token = userService.generateTokenForUser(req.user);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
};

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user._id);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await userService.updateUserProfile(req.user._id, req.body);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

// @desc    Forgot Password
// @route   POST /auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const result = await userService.forgotPassword(req.body.email);
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        const status = error.message === 'User not found' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleCallback,
    getUserProfile,
    updateProfile,
    forgotPassword,
};
