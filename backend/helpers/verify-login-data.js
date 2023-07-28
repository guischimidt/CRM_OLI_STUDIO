const verifyLoginData = (email, password) => {
	if (!email || email == '') {
		return 'O email é obrigatório';
	}
	if (!password || password == '') {
		return 'A senha é obrigatória';
	}
};

module.exports = verifyLoginData;