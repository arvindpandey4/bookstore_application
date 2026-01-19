const Book = require('../models/Book');
const { getClient } = require('../config/redis');

const getAllBooks = async (queryKeyword) => {
    const client = getClient();
    const cacheKey = queryKeyword ? `books:${queryKeyword}` : 'books:all';

    // 1. Try Cache
    if (client) {
        try {
            const cachedBooks = await client.get(cacheKey);
            if (cachedBooks) {
                return {
                    books: JSON.parse(cachedBooks),
                    source: 'cache'
                };
            }
        } catch (err) {
            console.error('Redis Get Error:', err);
        }
    }

    // 2. Query Database
    const keyword = queryKeyword
        ? { title: { $regex: queryKeyword, $options: 'i' } }
        : {};

    const books = await Book.find({ ...keyword });

    // 3. Set Cache
    if (client) {
        try {
            await client.set(cacheKey, JSON.stringify(books), { EX: 3600 }); // 1 Hour
        } catch (err) {
            console.error('Redis Set Error:', err);
        }
    }

    return { books, source: 'db' };
};

const getBookById = async (id) => {
    return await Book.findById(id);
};

module.exports = {
    getAllBooks,
    getBookById
};
