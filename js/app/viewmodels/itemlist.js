define([
	'namespace',
	'knockback'
], function (namespace, kb) {

	namespace('org.Collectist.App.ViewModels', {
		ItemList: kb.ViewModel.extend({
			constructor: function (model, options, viewModel) {
				var itemlist = this;

				kb.ViewModel.prototype.constructor.apply(itemlist, arguments);
			}
		})
	});

});