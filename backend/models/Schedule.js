const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Schedule = mongoose.model(
    'Schedule',
    new Schema({
        event_calendar: {
            type: Object,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        customer: {
            type: Object,
            required: true,
        },
        procedures: {
            type: Object,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        comments: {
            type: String,
            required: false,
        },
        payment: {
            type: Object,
            required: false,
        },
        reschedule_message: {
            type: Boolean,
            required: false,
        },
        remember_message: {
            type: Boolean,
            required: false,
        },
    },
        { timestamps: true },
    ),
);

module.exports = Schedule;