const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .post(protect, placeOrder)
    .get(protect, getOrders);

module.exports = router;
