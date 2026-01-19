const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({
            userId: req.user._id,
            bookId: bookId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this book'
            });
        }

        // Create review
        const review = await Review.create({
            userId: req.user._id,
            bookId,
            rating,
            comment
        });

        // Update book's average rating
        const reviews = await Review.find({ bookId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        book.averageRating = avgRating.toFixed(1);
        book.totalReviews = reviews.length;
        await book.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getBookReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addReview,
    getBookReviews
};
