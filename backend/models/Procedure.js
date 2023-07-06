const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Procedure = mongoose.model(
    'Procedure',
    new Schema({
        name: {
            type: String,
            required: true
        },
        price: {
            type: mongoose.Decimal128,
            required: true,
        },
        days_message: {
            type: Number,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        color: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true },
    ),
);

module.exports = Procedure;