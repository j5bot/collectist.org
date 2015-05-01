/*global addthis: true */
define([
	'jquery',
	'knockout'
], function ($, ko) {

	/**
	 * parameters to pass into addthisbutton binding
	 *
	 * @param {Observable}	title	title observable
	 * @param {Function}	url		url observable or method to obtain the observable
	 * @param {Array}		buttons	an array of button types,
	 *								use numbers for preferred dynamic buttons
	 **/
	ko.bindingHandlers['addthistoolbox'] = (function () {

		return {
			init: function (element, va, aba, viewModel, context) {
				var options = ko.utils.unwrapObservable(va()),
					$element = $(element),
					button;

				for (var i = 0, l = options.buttons.length; i < l; i++) {
					button = options.buttons[i];
					if (typeof button === 'number') {
						button = 'preferred_' + button.toString();
					}
					$element.append('<a class="addthis_button addthis_button_' + button + '"></a>');
				}

				// ko.bindingHandlers.event.init(element, function () {
				// 	return { click: options.url };
				// }, aba, viewModel, context);

				if (addthis) {
					addthis.toolbox(element);
				}
			},
			update: function (element, va, aba, viewModel, context) {
				// var options = ko.utils.unwrapObservable(va());

				// var url = options.url(),
				// 	title = options.title();

				// title = title || '';

				// addthis.update($('> a', element).get(), {}, { url: url, title: title });
			}
		};

	}());

});