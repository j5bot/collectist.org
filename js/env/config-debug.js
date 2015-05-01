define([], function () {
	return {
		paths: {
			// DOM and "looks"
			'jquery':		[
				'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery',
				'jquery'
			],

			'addthis': '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-516ee21b753d90e0',

			'knockback':	'knockback-core',

			// app framework
			'underscore':	'lodash.underscore',

			// app itself
			'app':			'../app',
			'env':			'../env',

			// data
			'data':			'../../data',

			'backbone-modelref':	'plugins/backbone-modelref',

			// html fragments
			'tmpl':			'../../templates',
			'templates':	'../../templates'
		}
	};
});