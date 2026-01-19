const Book = require('../models/Book');

const { getClient } = require('../config/redis');

// @desc    Fetch all books
// @route   GET /books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const client = getClient();
        const cacheKey = req.query.keyword ? `books:${req.query.keyword}` : 'books:all';

        if (client) {
            try {
                const cachedBooks = await client.get(cacheKey);
                if (cachedBooks) {
                    console.log('Serving from Cache');
                    return res.json({
                        success: true,
                        count: JSON.parse(cachedBooks).length,
                        data: JSON.parse(cachedBooks),
                        source: 'cache'
                    });
                }
            } catch (err) {
                console.error('Redis Get Error:', err);
            }
        }

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const books = await Book.find({ ...keyword });

        if (client) {
            try {
                await client.set(cacheKey, JSON.stringify(books), { EX: 3600 }); // Cache for 1 hour
            } catch (err) {
                console.error('Redis Set Error:', err);
            }
        }

        res.json({
            success: true,
            count: books.length,
            data: books
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
        const book = await Book.findById(req.params.id);

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
