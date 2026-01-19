const orderService = require('../services/order.service');

// @desc    Place new order
// @route   POST /orders
// @access  Private
const placeOrder = async (req, res) => {
    try {
        const { addressId } = req.body;
        const order = await orderService.placeOrder(
            req.user._id,
            req.user.email,
            addressId
        );

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });

    } catch (error) {
        // Simple error handling mapping
        let status = 500;
        if (error.message === 'Address not found' || error.message === 'Cart is empty') status = 404;
        if (error.message === 'Not authorized to use this address' || error.message === 'Payment failed') status = 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get logged in user orders
// @route   GET /orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getUserOrders(req.user._id);

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    placeOrder,
    getOrders,
};
