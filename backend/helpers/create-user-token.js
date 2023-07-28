const jwt = require('jsonwebtoken');
require('dotenv').config();

const createUserToken = async (user, req, res) => {

	const token = jwt.sign({
		name: user.name,
		id: user._id,
	}, process.env.SECRET);

	res.status(200).json({
		mensagem: 'Você está autenticado',
		id: user._id,
		data_criacao: user.createdAt,
		data_atualizacao: user.updatedAt,
		ultimo_login: user.last_login,
		token: token,
	});
};

module.exports = createUserToken;