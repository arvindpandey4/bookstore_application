const bookService = require('../services/book.service');

// @desc    Fetch all books
// @route   GET /books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const result = await bookService.getAllBooks(req.query.keyword);

        // Log source for debugging (optional)
        if (result.source === 'cache') console.log('Serving from Cache');

        res.json({
            success: true,
            count: result.books.length,
            data: result.books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Fetch single book
// @route   GET /books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);

        if (book) {
            res.json({
                success: true,
                data: book
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Book not found'
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
    getBooks,
    getBookById,
};
