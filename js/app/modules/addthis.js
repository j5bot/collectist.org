/*jshint camelcase: false */
/*global addthis: true, addthis_config: true, addthis_share: true */
define([
	'backbone',
	'underscore',
	'namespace'
], function (Backbone, underscore, namespace) {

	function makeLogin(app) {
		return function (user) {
			app.login({
				collectistid: user.service + '.' + (user.username || user.email || user.id),
				addthissignature: user.addthis_signature,
				link: user.link,
				email: user.email
			});
			app.trigger('login:success');
		};
	}

	namespace('org.Collectist.App', {
		AddThis: _.extend({
			init: function (app, toolboxRef) {
				var AddThis = this;
				this.toolbox = toolboxRef;

				window.addthis_config = {
					login: {
						services: {
							facebook: { id: app.facebook.apikey },
							google: { id: app.google.apikey }
						},
						callback: makeLogin(app)
					}
				};

				window.addthis_share = {
					templates: {
						twitter: app.twitter.template
					},
					url_transforms : {
						shorten: { twitter: 'bitly' }
					},
					shorteners : { bitly : {} }
				};

				require(['addthis'], function () {
					app.on('loaded:local loaded:collectist change:bytes login:success',
						AddThis.setURL, app);
				});
			},
			setURL: function (event) {
				var app = this,
					loc = window.location,
					host = loc.protocol + '//' + loc.host,
					user = this.loggedInUser ? this.loggedInUser.collectistid : 'visitor.name';

				if (!event) {
					addthis_share.url = addthis_share
						.url.replace(/\/collectist\/[^\/]*\//i, '/collectist/' + user + '/');
				} else {
					if (typeof event.url !== 'string') {
						event.url = event.collection.series.transformer.call(event.collection);
					}
					addthis_share.url = host + '/collectist/' + user + '/' + event.url;
				}
				addthis.update('share', 'url', addthis_share.url);
			}
		}, Backbone.Events)
	});

	return org.Collectist.App.AddThis;
});