const express = require('express');
const router = express.Router();
const { addReview, getBookReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, addReview);
router.get('/:bookId', getBookReviews);

module.exports = router;
