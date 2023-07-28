const verifyRegisterData = (name, email, password) => {

	if (!name || name == '') {
		return 'O nome é obrigatório';
	}
	if (!email || email == '') {
		return 'O email é obrigatório';
	}
	if (!password || password == '') {
		return 'A senha é obrigatória';
	}

};

module.exports = verifyRegisterData;