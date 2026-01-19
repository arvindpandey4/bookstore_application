const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const { processPayment } = require('../utils/mockPayment');
const { publishToQueue } = require('../config/rabbitmq');

const placeOrder = async (userId, userEmail, addressId) => {
    // 1. Validate Address
    const address = await Address.findById(addressId);
    if (!address) {
        throw new Error('Address not found');
    }
    if (address.userId.toString() !== userId.toString()) {
        throw new Error('Not authorized to use this address');
    }

    // 2. Validate Cart
    const cart = await Cart.findOne({ userId }).populate('items.bookId');
    if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
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

    // 4. Process Payment
    let paymentResult;
    try {
        paymentResult = await processPayment(
            userId,
            totalAmount,
            { itemCount: cart.items.length, address: address.city }
        );
    } catch (err) {
        throw new Error(err.message || 'Payment failed');
    }

    // 5. Create Order
    const order = await Order.create({
        userId: userId,
        items: orderItems,
        addressId: address._id,
        totalAmount: totalAmount,
        paymentStatus: paymentResult.paymentStatus,
        transactionId: paymentResult.transactionId
    });

    // 6. Clear Cart
    cart.items = [];
    await cart.save();

    // 7. Queue Notification
    await publishToQueue('email_queue', {
        type: 'ORDER_CONFIRMATION',
        email: userEmail,
        orderId: order._id
    });

    return order;
};

const getUserOrders = async (userId) => {
    return await Order.find({ userId })
        .populate('items.bookId')
        .populate('addressId')
        .sort({ createdAt: -1 });
};

module.exports = {
    placeOrder,
    getUserOrders
};
