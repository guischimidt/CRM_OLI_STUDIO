const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();

async function main() {
	console.log('Wait connecting to the database');
	await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log('MongoDB Atlas Connected');
}

main().catch((err) => console.log(err));

module.exports = mongoose;