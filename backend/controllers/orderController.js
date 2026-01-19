const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const { processPayment } = require('../utils/mockPayment');

// @desc    Place new order
// @route   POST /orders
// @access  Private
const placeOrder = async (req, res) => {
    try {
        const { addressId } = req.body;

        // 1. Validate Address
        const address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Ensure address belongs to user
        if (address.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to use this address'
            });
        }

        // 2. Validate Cart
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // 3. Calculate Total
        let totalAmount = 0;
        const orderItems = cart.items.map((item) => {
            const itemTotal = item.bookId.price * item.quantity;
            totalAmount += itemTotal;
            return {
                bookId: item.bookId._id,
                quantity: item.quantity,
                priceAtPurchase: item.bookId.price
            };
        });

        // 4. Process Mock Payment
        try {
            const paymentResult = await processPayment(
                req.user._id,
                totalAmount,
                { itemCount: cart.items.length, address: address.city }
            );

            // 5. Create Order
            const order = await Order.create({
                userId: req.user._id,
                items: orderItems,
                addressId: address._id,
                totalAmount: totalAmount,
                paymentStatus: paymentResult.paymentStatus,
                transactionId: paymentResult.transactionId
            });

            // 6. Clear Cart
            cart.items = [];
            await cart.save();

            // 7. Send Email Notification
            const { publishToQueue } = require('../config/rabbitmq');
            await publishToQueue('email_queue', {
                type: 'ORDER_CONFIRMATION',
                email: req.user.email,
                orderId: order._id
            });

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: order
            });

        } catch (paymentError) {
            return res.status(400).json({
                success: false,
                message: paymentError.message || 'Payment failed'
            });
        }

    } catch (error) {
        res.status(500).json({
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
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.bookId')
            .populate('addressId')
            .sort({ createdAt: -1 });

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
