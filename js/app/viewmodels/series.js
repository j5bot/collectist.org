define([
	'backbone',
	'namespace',
	'jquery',
	'knockout',
	'knockback',
	'plugins/jquery-transit-min'
], function (Backbone, namespace, $, ko, kb) {

	namespace('org.Collectist.App.ViewModels', {
		Series: kb.ViewModel.extend({
			constructor: function (model, options, viewModel) {
				var series = this;
				kb.ViewModel.prototype.constructor.apply(series, arguments);

				series.itemsection = ko.computed(function () {
					var series = this,
						itemlist = series.itemlist().items(),
						start = series.start && series.start(),
						end = series.end && series.end(),
						offset = series.offset && series.offset();

					if (offset === undefined) {
						offset = 0;
					}
					if (start === undefined) {
						start = 0;
					}
					if (end === undefined) {
						end = itemlist.length;
					}

					if (end + offset > itemlist.length + 1) {
						return [];
					}

					if (series.colors) {
						return itemlist.slice(start + offset - 1, end + offset).map(
							function (item, index, array) {
								var colors = (item.colors ||
									['1', '2', '3', '4', '5']).slice(0, series.colors());

								if (item['skip-color'] !== undefined) {
									colors.splice(item['skip-color'] - 1, 1);
								}
								item.colors = colors;
								return item;
							});
					} else {
						return itemlist.slice(start + offset - 1, end + offset);
					}

				}, series);

				series.template = ko.computed(function () {
					var series = this,
						app = org.Collectist.app;

					return (series.template && series.template()) ||
						app.sitehost + '-item-template';

				}, series);

			},

			count: function () {
				return this.end() - this.start() + 1;
			},

			itemsize: function () {
				var series = this;
				return 1 +
					(series.stickers && series.stickers() ? 1 : 0) +
					(series.colors ? series.colors() : 0);
			},

			index: function (index, offset, checkStickers) {
				var series = this;
				return series.itemsize() * index() +
					(offset || 0) +
					(checkStickers && series.stickers && series.stickers() ? 1 : 0);
			},

			primaryImage: function (number) {
				number = number.toString().length === 1 ? '0' + number : number;
				return this.images() + number + ((this.imagetype && this.imagetype()) || '.gif');
			},

			secondaryImage: function (number, color) {
				number = number.toString().length === 1 ? '0' + number : number;
				return this.images() + number + '-color' + (color() + 1) + '.gif';
			},

			getChecklist: function () {
				var context = this,
					id = context.id(),
					checklist = context.checklist(),
					citems = ko.utils.arrayFilter(context.checklists(), function (item) {
						return item.id() === id + '/' + checklist;
					}),
					item = citems.length > 0 ? citems[0] : null;

				return item;
			},

			hasStickers: function () {
				return (this.stickers && this.stickers()) || false;
			},

			animateCollection: function (data, event) {
				var app = org.Collectist.app,
					target = event.target,
					$logo = $('header .logo'),
					$img = $(target).parent().children('img'),
					aniDupe, offset, logoOffset, logoDimensions;

				if ($img.size() > 0) {
					aniDupe = $img.clone();
					offset = $img.offset();
					logoOffset = $logo.offset();
					logoDimensions = { height: $logo.height(), width: $logo.width() };
					aniDupe.css({
						position: 'absolute',
						top: offset.top + 'px',
						left: offset.left + 'px',
						'z-index': 100,
						'border-radius': '10px',
						width: $img.width() + 'px',
						height: $img.height() + 'px'
					});
					$('body').append(aniDupe);
					aniDupe.transition({
						x: (offset.left - (logoOffset.left + logoDimensions.width / 2)) * -1,
						y: (offset.top - (logoOffset.top + logoDimensions.height / 2)) * -1,
						height: $img.height() / 10,
						width: $img.width() / 10
					}, 800, 'easeInSine').
						fadeOut(100, function () {
							aniDupe.remove();
						});
				}
			},

			tick: function (data, event) {
				var app = org.Collectist.app,
					router = app.router,
					target = event.target,
					$target = $(target),
					context = ko.contextFor(target),
					checklist = context.serieslist.getChecklist(),

					data, item,
					position = parseInt($target.attr('value'), 10),
					checked = $target.is(':checked');

				if (checked) {
					context.serieslist.animateCollection(data, event);
				}

				if (checklist !== null) {
					data = checklist.bytes();
					data[checked ? 'on' : 'off'](position);
					checklist.bytes(data);
					checklist.data(data.bytes);
					Backbone.sync('update', checklist.model(), {
						success: function (model) {
							// var db64 = data.toBase64();
							// router.navigate('series/' + model.id + '/' + db64);
						}
					});
				}

				return true;
			},

			tock: function (index, offset, checkStickers) {
				var checklist = this.getChecklist(),
					position = this.index(index, offset, checkStickers),
					data = checklist !== null ? checklist.bytes() : null,
					result;

				result = data !== null ? data.read(position) : false;
				if (checklist) {
					// console.log((checklist.id && checklist.id()) +
					// 	': ' + position + ', ' + result + ', data: ' +
					// 	JSON.stringify(data.bytes));
				}
				return result;
			}
		})
	});

});