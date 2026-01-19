const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { publishToQueue } = require('../config/rabbitmq');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Check existing
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password // Hashed in pre-save hook
    });

    if (user) {
        // Send Welcome Email
        await publishToQueue('email_queue', {
            type: 'WELCOME_EMAIL',
            email: user.email,
            name: user.name
        });
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

const getUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
    } else {
        throw new Error('User not found');
    }
};

const updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (user) {
        user.name = updateData.name || user.name;
        user.email = updateData.email || user.email;
        if (updateData.password) {
            user.password = updateData.password;
        }

        const updatedUser = await user.save();
        return {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        };
    } else {
        throw new Error('User not found');
    }
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    // Generate Token
    const resetToken = generateToken(user._id);
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // Queue Email
    await publishToQueue('email_queue', {
        type: 'RESET_PASSWORD',
        email: user.email,
        link: resetLink
    });

    return { message: 'Password reset link sent' };
};

// Google Callback Logic remains mostly in controller or here?
// Ideally here, but controller handles the redirect. 
// We can expose a method to generate token for google user.
const generateTokenForUser = (user) => {
    return generateToken(user._id);
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    generateTokenForUser
};
