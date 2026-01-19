const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Colors library not installed, removing style chaining
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
