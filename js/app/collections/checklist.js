/**
 * app/collections/checklist.js
 *
 * the checklist collection is an explicitly set collection containing
 * 'have', 'want', 'sell', and 'trade' checklists
 *
 * the checklists are stored with localStorage via the plugin, and
 * fetched on init, with a default added for any missing lists
 */
/*jshint camelcase: false */
define([
	'backbone',
	'underscore',
	'namespace',
	'plugins/backbone-localstorage',
	'app/models/checklist'
], function (Backbone, _, namespace) {

	namespace('org.Collectist.App.Collections', {
		Checklist: Backbone.Collection.extend({
			idAttribute: 'id',
			localStorage: new Backbone.LocalStorage('checklist'),
			constructor: function (models, options) {
				this.series = options.series;
				this.checklist = options.checklist;
				this.localStorage = options.localStorage || this.localStorage;
				this.params = options.params || {};
				this.constructor.__super__.constructor.apply(this, arguments);
			},
			initialize: function () {
				var app = org.Collectist.app,
					checklists = this;

				if (checklists.params.collectist) {
					checklists.series.transformer(checklists, checklists.params.collectist);
				} else {
					checklists.fetch({
						success: function (model, response, options) {
							_.each(['have', 'want', 'sell', 'trade'],
								function (item, index, collection) {
									checklists.addDefault(item);
								});
							app.trigger('loaded:local', {
								url: checklists.series.transformer.call(checklists)
							});
						},
						error: function () {
							debugger;
						}
					});
				}
			},
			addDefault: function (name) {
				var seriesid = this.series.id;
				if (!this.get(seriesid + '/' + name)) {
					this.add(this.create({ id: seriesid + '/' + name }));
				}
			}
		})
	});

	return org.Collectist.App.Collections.Checklist;

});