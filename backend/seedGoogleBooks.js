const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Book = require('./models/Book');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Search queries to get diverse books
const searchQueries = [
    'javascript', 'python', 'design', 'business', 'fiction',
    'science', 'history', 'cooking', 'art', 'psychology',
    'programming', 'web development', 'data science', 'machine learning',
    'self help', 'biography', 'thriller', 'romance', 'fantasy'
];

const fetchBooksFromGoogle = async () => {
    const allBooks = [];

    for (const query of searchQueries) {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&key=${GOOGLE_BOOKS_API_KEY}`
            );

            if (response.data.items) {
                const books = response.data.items.map(item => {
                    const volumeInfo = item.volumeInfo;

                    // Generate random price between 500-2500
                    const price = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
                    const discountPrice = Math.floor(price * 1.3); // 30% discount

                    // Get image URL and convert to https, prefer larger images
                    let imageUrl = '';
                    if (volumeInfo.imageLinks) {
                        imageUrl = volumeInfo.imageLinks.medium ||
                            volumeInfo.imageLinks.large ||
                            volumeInfo.imageLinks.small ||
                            volumeInfo.imageLinks.thumbnail ||
                            volumeInfo.imageLinks.smallThumbnail || '';

                        // Convert http to https
                        if (imageUrl) {
                            imageUrl = imageUrl.replace('http://', 'https://');
                            // Remove zoom parameter to get better quality
                            imageUrl = imageUrl.replace('&zoom=1', '');
                        }
                    }

                    return {
                        title: volumeInfo.title || 'Unknown Title',
                        author: volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown Author',
                        price: price,
                        discountPrice: discountPrice,
                        stock: Math.floor(Math.random() * 100) + 10,
                        description: volumeInfo.description || 'No description available',
                        averageRating: volumeInfo.averageRating || (Math.random() * 2 + 3).toFixed(1),
                        totalReviews: volumeInfo.ratingsCount || Math.floor(Math.random() * 100),
                        imageUrl: imageUrl
                    };
                });

                allBooks.push(...books);
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            console.error(`Error fetching books for query "${query}":`, error.message);
        }
    }

    return allBooks;
};

const importGoogleBooks = async () => {
    try {
        console.log('Fetching books from Google Books API...');
        const books = await fetchBooksFromGoogle();

        console.log(`Fetched ${books.length} books from Google Books API`);

        // Clear existing books
        await Book.deleteMany();
        console.log('Cleared existing books');

        // Insert new books
        await Book.insertMany(books);
        console.log(`Successfully imported ${books.length} books!`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importGoogleBooks();
