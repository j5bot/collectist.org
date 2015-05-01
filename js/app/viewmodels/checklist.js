define([
	'namespace',
	'knockback'
], function (namespace, kb) {

	namespace('org.Collectist.App.ViewModels', {
		Checklist: kb.ViewModel.extend({
			constructor: function (model, options, viewModel) {
				var checklist = this;

				kb.ViewModel.prototype.constructor.apply(checklist, arguments);
			}
		})
	});

});