const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:bookId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
