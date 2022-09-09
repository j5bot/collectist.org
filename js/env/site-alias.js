define([], function () {

	return function (hostname) {

		switch (hostname) {
		case 'www':
		case 'collectist':
			hostname = 'www';
			break;
        case 'localhost':
        case 'gogos':
        default:
            hostname = "gogos";
            break;
		}

		return hostname;
	};

});