const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Users = mongoose.model(
	'Users',
	new Schema({
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		last_login: {
			type: Date,
			default: Date.now
		}
	}, { timestamps: true },
	),
);

module.exports = Users;