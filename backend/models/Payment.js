const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Payment = mongoose.model(
    'Payment',
    new Schema({
        name: {
            type: String,
            required: true
        },
        tax: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
    ),
);

module.exports = Payment;