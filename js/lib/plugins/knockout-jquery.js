define([
	'knockout',
	'jquery'
], function (ko, $) {
	
	return ko.applyBindings.$ = function (viewModel, selector, limit) {
		(limit === true ? $(selector).first() : $(selector)).each(function (index) {
			if (limit === undefined || index < limit) {
				ko.applyBindings(viewModel, this);
			}
		});
	};

});