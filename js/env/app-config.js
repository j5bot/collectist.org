/**
 * env/app-config.js
 *
 * Define the application configuration module, which loads the
 * application's configuration JSON file, extends the app object
 * and updates elements in the page head (title and a new stylesheet)
 * also bootstraps the addthis module
 */
define([
	'jquery',
	'env/site-alias',
	'app/modules/addthis',
	'app/modules/checklist/walkthrough'
], function ($, alias, addthisModule, walkthrough) {

	/**
	 * return the module as a function
	 *
	 * @param  {Object} app the application object to load data for
	 *                      and to extend with config data
	 */
	return function (app) {

		// get the hostname for the site, so we show the right one :)
		app.sitehost = alias(window.location.hostname.split('.')[0]);

		/**
		 * update things in the head of the document: the title and
		 * optional application stylesheet, also addthis toolbox
		 *
		 * @param  {Object} response the JSON response received
		 * @param  {String} status   server response code
		 * @param  {jqXHR}  xhr      jqXHR object for the request
		 */
		function updatePage(response, status, xhr) {

			function hideWalkthrough () {
				window.localStorage.setItem('hide-walkthrough', 'true');
			}

			function showWalkthrough () {
				if (window.localStorage.getItem('hide-walkthrough') !== 'true') {
					walkthrough(hideWalkthrough);
				}
			}

			$.extend(app, response, { walkthrough: walkthrough });

			// TODO: move into a separate location somewhere
			$('title').html(app.title + ' :: COLLECT / or checkl / IST');
			if (app.stylesheet) {
				$('head').
				append('<link rel="stylesheet" type="text/css" href="' + app.stylesheet + '" />');
			}

			addthisModule.init(app, '.addthis_toolbox');

			showWalkthrough();
		}

		// load the app config for this site
		$.ajax({
			url: '/data/' + app.sitehost + '/config.json',
			type: 'get',
			contentType: 'application/json',
			success: updatePage
		});
	};

});