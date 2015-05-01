/**
 * app/models/series.js
 *
 * a model for series, which contain an itemlist model
 * and checklists collection
 */
define([
	'backbone',
	'namespace',
	'app/modules/checklist/transformer',
	'app/collections/checklist',
	'app/models/itemlist'
], function (Backbone, namespace, transformer) {

	namespace('org.Collectist.App.Models', {

		Series: Backbone.Model.extend({
			transformer: transformer,
			idAttribute: 'id',
			initialize: function () {
				// load localStorage data for checklists
				var series = this,

					app = org.Collectist.app,

					App = org.Collectist.App,
					Collections = App.Collections,
					Models = App.Models,
					ViewModels = App.ViewModels;

				series.set({ 'itemlist': new Models.ItemList({
					source: this.get('source'),
					site: app.sitehost
				}) });

				series.set({ 'checklist': 'have' });

				series.set({ 'checklists': new Collections.Checklist([], {
					localStorage: new Backbone.LocalStorage(
						app.guest ? app.checklist.params.user : 'checklist'),
					model: org.Collectist.App.Models.Checklist,
					series: series,
					site: app.sitehost,
					params: app.checklist.params
				}) });

				series.get('checklists').fetch();

			}
		})

	});

	return org.Collectist.App.Models.Series;

});