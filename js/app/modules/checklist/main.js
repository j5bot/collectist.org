/**
 * app/module/checklist/main.js
 *
 * define the module for a checklist, which is the primary
 * functionality of the application
 */
define([
	'backbone',
	'namespace',

	'knockout',

	// plugin to extend ko.applyBindings to bind to
	// anything which can be used to create a jquery
	// object with $()
	'plugins/knockout-jquery',

	'app/collections/series',
	'app/viewmodels/app',
	'app/viewmodels/series',
	'app/viewmodels/itemlist',

	// custom knockout bindings used by the module
	'app/bindings/series',
	'app/bindings/addthis'
], function (Backbone, namespace, ko) {
	// import-like references to namespaced 'classes'
	// and objects
	var app = org.Collectist.app,
		router = app.router,
		series,

		App = org.Collectist.App,
		Collections = App.Collections,
		Models = App.Models,
		ViewModels = App.ViewModels;

	/**
	 * checklist module
	 * the router calls the checklist module with the appropriate params
	 * to load the checklist expressed by the URL
	 *
	 * @param {Object} options options parsed from the URL
	 */
	return function (params) {
		// set the guest option based on whether we have a whole collection in the URL
		params = params || {};
		app.guest = params.guest = !!params.collectist;
		app.checklist = { params: params };

		// checklist source collection
		series = new Collections.Series(null, {
			model: Models.Series,
			url: '/data/' + app.sitehost + '/series.json'
		});

		/**
		 * apply the current ids to the viewmodel if one exists
		 */
		if (params.seriesid && app.appViewModel) {
			app.appViewModel.current(params.seriesid);
			if (params.seriesid) {
				app.appViewModel.checklist(params.seriesid);
			}
		} else {
			/**
			 * if there's not already a viewmodel, fetch the series data
			 */
			series.fetch({

				user: params.user,
				guest: params.guest,
				collectist: params.collectist,

				series: params.seriesid,
				checklist: params.checklist,
				data: params.data,

				success: function (collection, response, options) {
					// determine the proper series, checklist, and data properties
					// for the viewmodel
					options.series = options.series || series.at(0).get('id');
					options.checklist = options.checklist ||
						series.at(0).get('checklists').at(0).id.split('/').pop() ||
						options.series + '/have';
					options.data = options.data ||
						series.at(0).get('checklists').at(0).get('bytes').toBase64();

					// create the application viewmodel
					// leverage the knockback factories options to define
					// viewmodels for collections and model properties of the app
					var appViewModel = new ViewModels.App(new Backbone.Model({

						guest: options.guest,
						user: options.user,
						collectist: options.collectist,

						current: options.series,

						checklist: options.checklist,
						data: options.data,
						series: series,

						title: app.title

					}), {
						factories: {
							'series.models': ViewModels.Series,
							'series.models.itemlist': ViewModels.ItemList,
							'series.models.checklists.models': ViewModels.Checklist
						}
					});

					// TODO: can we get this from the inbound route to handle both
					// cases with the same code?
					// if (options.guest) {
					// 	debugger;
					// 	router.navigate('/collectist/:user/:collectist', false, options);
					// } else {
					// 	// set the URL to reflect the current app state
					// 	router.navigate('/series/:series/:checklist/:data', false, options);
					// }

					// append markup for the app and the menu
					$('#app').append($('#main-template').html());
					$('#menu').append($('#menu-template').html());

					// apply knockout bindings for the header, menu, and app
					ko.applyBindings.$(appViewModel, 'header', true);
					ko.applyBindings.$(appViewModel, '.share-container', true);

					ko.applyBindings.$(appViewModel, '#menu', true);
					ko.applyBindings.$(appViewModel, '#app', true);

					// hold a reference to the viewmodel
					app.appViewModel = appViewModel;
				},
				error: function (collection, response, options) {
					debugger;
				}
			});
		}
	};
});