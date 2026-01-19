const Cart = require('../models/Cart');
const Book = require('../models/Book');

// @desc    Get user cart
// @route   GET /cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');

        if (!cart) {
            // Return empty cart structure if not found
            return res.json({
                success: true,
                data: { items: [] }
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add item to cart
// @route   POST /cart/add
// @access  Private
const addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user._id,
                items: [{ bookId, quantity: quantity || 1 }],
            });
        } else {
            // Check if product exists in cart
            const itemIndex = cart.items.findIndex(
                (item) => item.bookId.toString() === bookId
            );

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += (quantity || 1);
            } else {
                // Add new item
                cart.items.push({ bookId, quantity: quantity || 1 });
            }

            await cart.save();
        }

        // Populate for response
        cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');

        res.json({
            success: true,
            message: 'Item added to cart',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /cart/remove/:bookId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            cart.items = cart.items.filter(
                (item) => item.bookId.toString() !== req.params.bookId
            );

            await cart.save();

            cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');

            res.json({
                success: true,
                message: 'Item removed from cart',
                data: cart
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Clear cart
// @route   DELETE /cart/clear
// @access  Private
const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();

            res.json({
                success: true,
                message: 'Cart cleared successfully',
                data: cart
            });
        } else {
            res.json({
                success: true,
                message: 'Cart already empty'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
};
