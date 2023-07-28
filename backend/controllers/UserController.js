const User = require('../models/User');
const bcrypt = require('bcrypt');

require('dotenv').config();

const createUserToken = require('../helpers/create-user-token');
const verifyLoginData = require('../helpers/verify-login-data');
const verifyRegisterData = require('../helpers/verify-register-data.js');

module.exports = class UserController {

	static async sign_up(req, res) {
		const { name, email, password } = req.body;

		const verifiedRegister = verifyRegisterData(name, email, password);

		if (verifiedRegister) {
			return res.status(422).json({ mensagem: verifiedRegister });
		}

		const userExists = await User.findOne({ email: email });


		if (userExists) {
			res.status(422).json({ mensagem: 'E-mail já existente' });
			return;
		}

		const salt = await bcrypt.genSalt(12);
		const passwordHash = await bcrypt.hash(password, salt);

		const user = new User({
			name,
			email,
			password: passwordHash,
		});

		try {
			const newUser = await user.save();
			await createUserToken(newUser, req, res);
		}
		catch (error) {
			res.status(500).json({ mensagem: error });
		}
	}

	static async sign_in(req, res) {
		const { email, password } = req.body;

		const verifiedLogin = verifyLoginData(email, password);

		if (verifiedLogin) {
			return res.status(422).json({ message: verifiedLogin });
		}

		const user = await User.findOneAndUpdate(
			{ email: email },
			{ '$set': { 'last_login': Date.now() } },
			{ new: true });

		if (!user) {
			res.status(401).json({ message: 'Usuário e/ou senha inválidos2' });
			return;
		}

		const checkPassword = await bcrypt.compare(password, user.password);

		if (!checkPassword) {
			res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos1' });
			return;
		}

		await createUserToken(user, req, res);
	}

};