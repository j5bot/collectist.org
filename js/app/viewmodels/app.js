/**
 * app/viewmodels/app.js
 *
 * the app viewmodel is responsible for loading the templates
 * into the page and is the container for series
 */
define([
	'namespace',
	'jquery',
	'knockback',
	'app/modules/checklist/transformer',
	'text!templates/checklist.html'
], function (namespace, $, kb, transformer, templateMarkup) {

	namespace('org.Collectist.App.ViewModels', {
		App: kb.ViewModel.extend({
			transformer: transformer,
			constructor: function (model, options, viewModel) {
				var appVM = this,
					$fragment = $(templateMarkup);

				$fragment.filter('script').each(function (index) {
					if (!document.getElementById(this.id)) {
						$('#templates').append(this);
					}
				});

				kb.ViewModel.prototype.constructor.apply(appVM, arguments);
			},

			makeLink: function () {
				var app = org.Collectist.app,
					link, user = app.loggedInUser;
					// user = window.prompt('enter an id')

				if (user && this.transformer) {
					link = this.transformer();
					// console.log(link);
					org.Collectist.app.router.navigate('/collectist/:user/:link', false, {
						user: user.collectistid,
						link: link
					});
				}
			},

			isCurrent: function (seriesid) {
				return this.current() === seriesid();
			}
		})
	});

});