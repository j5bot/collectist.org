/**
 * app/bindings/series.js
 *
 * add the seriesitem binding to knockout, which is used for the checkboxes
 */
define([
	'knockout'
], function (ko) {

	/**
	 * seriesitem binding handler wraps checked, click, and value bindings
	 */
	return ko.bindingHandlers['seriesitem'] = (function () {

		// make a closured accessor function for applying other bindings
		// for either the tick or index methods of Viewmodels.Series
		function makeTockOrIndex(serieslist, type, index, offset, sticker) {
			return function () {
				return serieslist[type](index, offset, sticker);
			};
		}

		// make a closured accessor function for applying event handler bindings
		function makeEventAccessor(event, func) {
			var eventAccessor = {};

			eventAccessor[event] = func;

			return function () {
				return eventAccessor;
			};
		}

		// return the object with init and update methods for the binding
		return {
			init: function (element, va, aba, viewModel, context) {
				var options = ko.utils.unwrapObservable(va()),
					$element = $(element),

					// create an ID for the element
					elid = options.serieslist.id() +
						'-' + options.serieslist.index(
							options.index, options.offset, options.colors
					);

				/**
				 * if we're trying to add an item for a sticker, but this series
				 * doesn't have stickers, hide the custom checkbox and remove
				 * the checkbox
				 */
				if (options.sticker && !options.serieslist.hasStickers()) {
					// for some reason, removing the element breaks the next element's
					// text binding
					$(element).next('.sticker.custom-checkbox').hide();
					$(element).remove();
				} else {
					/**
					 * otherwise we'll apply the id, and the other binding handlers
					 */
					$element.attr('id', elid).parent().attr('for', elid);

					ko.bindingHandlers.checked.init(element,
						makeTockOrIndex(
							options.serieslist, 'tock', options.index,
								options.offset, options.colors),
						aba, viewModel, context);

					ko.bindingHandlers.event.init(element,
						makeEventAccessor('click', options.serieslist.tick),
						aba, viewModel, context);

					ko.bindingHandlers.value.init(element,
						makeTockOrIndex(
							options.serieslist, 'index', options.index,
								options.offset, options.colors),
						aba, viewModel, context);
				}
			},

			// very similar to init, but note that event binding doesn't have
			// an update handler, so that is skipped
			update: function (element, va, aba, viewModel, context) {
				var options = ko.utils.unwrapObservable(va());

				if (options.sticker && !options.serieslist.hasStickers()) {
					return;
				}

				ko.bindingHandlers.checked.update(element,
					makeTockOrIndex(
						options.serieslist, 'tock', options.index,
							options.offset, options.colors),
					aba, viewModel, context);

				ko.bindingHandlers.value.update(element,
					makeTockOrIndex(
						options.serieslist, 'index', options.index,
							options.offset, options.colors),
					aba, viewModel, context);
			}
		};
	}());

});