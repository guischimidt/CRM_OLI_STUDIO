const jwt = require('jsonwebtoken');
const getToken = require('./get-token.js');

require('dotenv').config();

const checkToken = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json({ mensagem: 'Não autorizado' });
	}

	const token = getToken(req);

	if (!token) {
		return res.status(401).json({ mensagem: 'Não autorizado' });
	}

	try {
		const verified = jwt.verify(token, process.env.SECRET);
		req.user = verified;
		next();
	}
	catch (err) {
		return res.status(400).json({ mensagem: 'Token inválido' });
	}
};

module.exports = checkToken;