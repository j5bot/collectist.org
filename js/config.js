/**
 * config.js
 *
 * define the environment configuration 'env-config' module
 * which brings in the debug config options from 'env/config-debug'
 * and sets all of the necessary URL and path options for require
 * and then executes the main script '/js/main.js' using require
 */
define('env-config', [
	'env/config-debug'
], function (config) {

	// basic configuration
	requirejs.config({
		// location for all non-app scripts
		baseUrl: '/js/lib',
		// add dependencies and export information for
		// scripts not wrapped as modules
		shim: {
			'backbone': {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone'
			},
			'addthis': {
				exports: 'addthis'
			}
		}
	});

	// implement the environment-specific config
	requirejs.config(config);
	// run 'main' module
	require(['/js/main.js']);
});

/**
 * Execute the 'env-config' module to create the config
 * and trigger the 'main' module
 */
require(['env-config']);