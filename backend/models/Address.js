const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            trim: true,
        },
        street: {
            type: String,
            required: [true, 'Please add a street address'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'Please add a city'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'Please add a state'],
            trim: true,
        },
        pincode: {
            type: String,
            required: [true, 'Please add a pincode'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['HOME', 'WORK', 'OTHER'],
            default: 'HOME'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Address', addressSchema);
