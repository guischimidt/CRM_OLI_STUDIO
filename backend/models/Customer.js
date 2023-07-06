const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Customers = mongoose.model(
    'Customers',
    new Schema({
        name: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        bday: {
            type: Number,
            required: false,
        },
        bmonth: {
            type: Number,
            required: false,
        },
        byear: {
            type: Number,
            required: false,
        },
        comments: {
            type: String,
            required: false,
        },
        last_visit: {
            type: Date,
            required: false,
        },
        amount: {
            type: Number,
            required: false,
        }
    },
        { timestamps: true },
    ),
);

module.exports = Customers;