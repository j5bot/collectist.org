/**
 * app/models/checklist.js
 *
 * the checklist model wraps a BigBit instance, BigBit gives you an
 * unlimited number of binary registers stored using an integer array
 * a string representation is available as binary and in base64
 */
require([
	'backbone',
	'namespace',
	'bigbit'
], function (Backbone, namespace, BigBit) {

	namespace('org.Collectist.App.Models', {
		Checklist: Backbone.Model.extend({
			defaults: {
				data: { length: 0 }
			},

			idAttribute: 'id',

			initialize: function () {
				this.set('bytes', new BigBit(this.get('data'), 8));
				this.on('change:bytes', this.bytesChanged);
			},

			bytesChanged: function (event) {
				var app = org.Collectist.app;
				app.trigger('change:bytes', event);
			}
		})
	});

});