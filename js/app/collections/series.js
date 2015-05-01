define([
	'backbone',
	'namespace',
	'app/models/series'
], function (Backbone, namespace) {

	namespace('org.Collectist.App.Collections', {

		Series: Backbone.Collection.extend({
			parse: function (response, options) {
				if (response && response.series) {
					return response.series;
				}
				return response;
			}
		})

	});

	return org.Collectist.App.Collections.Series;

});