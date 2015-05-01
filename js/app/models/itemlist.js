/**
 * app/models/itemlist.js
 *
 * a list of items which are part of a series, corresponding to checklists
 */
require([
	'backbone',
	'namespace'
], function (Backbone, namespace) {

	namespace('org.Collectist.App.Models', {
		ItemList: Backbone.Model.extend({
			defaults: {
				items: []
			},
			initialize: function () {
				this.fetch();
			},
			url: function () {
				return '/data/' + this.get('site') +
					'/' + (this.get('source') || 'items') + '.json';
			}
		})
	});

});