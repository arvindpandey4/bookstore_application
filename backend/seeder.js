const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors'); // Optional, but good for console
const startCase = require('lodash.startcase'); // Not installed, I'll avoid dependencies

const Book = require('./models/Book');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const books = [
    {
        title: "Don't Make Me Think",
        author: 'Steve Krug',
        price: 1500,
        discountPrice: 2000,
        stock: 50,
        description: 'A Common Sense Approach to Web Usability',
        averageRating: 4.5,
        totalReviews: 20,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/41-sN-mzwKL.jpg'
    },
    {
        title: 'React Material-UI Cookbook',
        author: 'Adam Boduch',
        price: 1200,
        discountPrice: 1500,
        stock: 25,
        description: 'Build modern-day applications with Material-UI and React',
        averageRating: 4.2,
        totalReviews: 12,
        imageUrl: 'https://m.media-amazon.com/images/I/71rFSZq-0kL._AC_UF1000,1000_QL80_.jpg'
    },
    {
        title: 'Mastering SharePoint Framework',
        author: 'Stéphane Eyskens',
        price: 1800,
        discountPrice: 2200,
        stock: 10,
        description: 'Mastering SharePoint Framework',
        averageRating: 4.0,
        totalReviews: 8,
        imageUrl: 'https://m.media-amazon.com/images/I/61r5f6y+d7L.jpg'
    },
    {
        title: 'UX For Dummies',
        author: 'Steve Krug',
        price: 1500,
        discountPrice: 2000,
        stock: 0, // Out of Stock
        description: 'UX For Dummies',
        averageRating: 4.5,
        totalReviews: 20,
        imageUrl: 'https://m.media-amazon.com/images/I/51wXkYL-oGL.jpg'
    },
    {
        title: 'A Project Guide to UX Design',
        author: 'Russ Unger',
        price: 1350,
        stock: 30,
        description: 'For user experience designers',
        averageRating: 4.6,
        totalReviews: 15,
        imageUrl: 'https://m.media-amazon.com/images/I/71G12c0iV2L.jpg'
    },
    {
        title: 'Group Discussion',
        author: 'Unknown',
        price: 500,
        stock: 100,
        description: 'Tips for group discussion',
        averageRating: 3.5,
        totalReviews: 5,
        imageUrl: 'https://m.media-amazon.com/images/I/71C7+iMh7dL.jpg'
    },
    {
        title: 'Lean UX',
        author: 'Jeff Gothelf',
        price: 1600,
        stock: 40,
        description: 'Designing Great Products with Agile Teams',
        averageRating: 4.8,
        totalReviews: 25,
        imageUrl: 'https://m.media-amazon.com/images/I/81Pj2iD-x4L.jpg'
    },
    {
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        price: 1400,
        stock: 60,
        description: 'Revised and Expanded Edition',
        averageRating: 4.9,
        totalReviews: 100,
        imageUrl: 'https://m.media-amazon.com/images/I/410RTQezHYL._AC_SY200_QL15_.jpg'
    }
];

const importData = async () => {
    try {
        await Book.deleteMany();
        await Book.insertMany(books);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Book.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
