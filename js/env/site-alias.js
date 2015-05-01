define([], function () {

	return function (hostname) {

		switch (hostname) {
		case 'www':
		case 'collectist':
		case 'localhost':
			hostname = 'www';
			break;
		}

		return hostname;
	};

});