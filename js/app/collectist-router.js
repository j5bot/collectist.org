/**
 * app/collectist-router.js
 *
 * define the main application router as an anonymous module,
 * but also namespace it as org.Collectist.App.Router
 */
define([
	'backbone',
	'underscore',
	'jquery',
	'namespace',
	'app/collections/series'
], function (Backbone, _, $, namespace) {

	namespace('org.Collectist.App', {
		Router: Backbone.Router.extend({
			initialize: function () {
				/**
				 * handle all clicks on A elements by delegating to the router
				 */
				var app = org.Collectist.app;

				$(document).delegate('a', 'click', function (event) {
				    var href = $(this).attr('href');
				    var protocol = this.protocol + '//';

				    // Ensure the protocol is not part of URL, meaning its relative.
				    // Stop the event bubbling to ensure the link will not cause a page refresh.
				    if (href && (href.slice(0, protocol.length) !== protocol)) {
						event.preventDefault();
						if (!app.guest) {
							app.router.navigate(href, true);
						} else {
							app.appViewModel.current(href.split('/',3)[2]);
						}
					}
				});
			},

			routes: {
				'collectist/:user/*collectist': 'collectistRoute',
				'series/:seriesid': 'seriesRoute',
				'series/:seriesid/:checklist/:data': 'seriesRoute',
				'*url': 'defaultRoute'
			},

			collectistRoute: function (user, collectist) {
				require(['app/modules/checklist/main'], function (checklistModule) {
					checklistModule({ user: user, collectist: collectist });
				});
			},

			seriesRoute: function (seriesid, checklist, data) {
				require(['app/modules/checklist/main'], function (checklistModule) {
					checklistModule({
						seriesid: seriesid,
						checklist: checklist,
						data: data
					});
				});
			},

			defaultRoute: function (url) {
				var site = this.sitehost;

				if (site !== 'www') {
					require(['app/modules/checklist/main'], function (checklistModule) {
						checklistModule();
					});
				} else {
					debugger;
				}
			},

			/**
			 * navigate:    override the default navigation behavior to
			 *				add params behavior similar to inbound routes
			 * 
			 * @param  {String} url     url to navigate to, can include :foo style params
			 * @param  {Object} options options object or true/false
			 * @param  {Object} params  params object to merge with url
			 *
			 * example:		router.navigate('/category/:category/item/:item',
			 *					true,
			 *					{
			 *						'category': 'foo',
			 *						'item': 'baz'
			 *					}
			 *				);
			 *
			 *				navigates to '/category/foo/item/baz'
			 */
			navigate: function (url, options, params) {
				var param, paramValue;

				function mergeParam (value, param) {
					if (value !== undefined && value !== 'undefined') {
						url = url.replace(':' + param, value);
					}
				}

				if (params) {
					_.forEach(params, mergeParam);
					url = url.replace(/\:[a-z0-9_-]*/ig, '').replace('//','/');
				}
				// run the original navigation method with the new, merged url
				this.constructor.__super__.navigate(url, options);
			}
		})
	});

	return org.Collectist.App.Router;
});