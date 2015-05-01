/**
 * app/modules/checklist/transformer.js
 *
 * read/write collection URLs
 **/
define([
	'backbone',
	'bigbit'
], function (Backbone, BigBit) {

	function makeCollection(checklists, series, value) {

		var id = series.get('id'),
			segments = value.match(new RegExp(id + '\\.[^.]*\\.[^.]*')),
			segment, checklist, bytes;

		if (segments && segments.length > 0) {
			for (var i = 0, l = segments.length; i < l; i++) {
				// console.log(segments[i]);
				segment = segments[i].split('.');
				checklist = checklists.get(segment[0] + '/' + segment[1]);
				if (!checklist) {
					checklist = checklists.create({ id: segment[0] + '/' + segment[1] });
				}
				bytes = new BigBit();
				bytes.fromBase64(segment[2]);
				checklist.set({ data: bytes.bytes, bytes: bytes });
				Backbone.sync('update', checklist);
			}
			Backbone.Events.trigger('loaded:collectist', {
				url: stringifyCollection(checklists)
			});
		}

	}

	function stringifyCollection(checklists) {
		var collectist = checklists.reduce(function (memo, checklist, key, list) {
				var bytes = checklist.get('bytes'),
					id = checklist.get('id').replace('/', '.');

				if (bytes && bytes.length && bytes.length() > 0) {
					memo.push(id + '.' + bytes.toBase64());
				}
				return memo;

			}, []).join('.');

		return collectist;
	}

	/**
	 * transformer module
	 *
	 * @param  {String} value when value is specified, a collection of checklists
	 *                        will be returned matching with the value
	 * @return {String}       a partial URL representing all series and checklists in the
	 *                        current app
	 */
	return function (checklists, value) {

		if (value !== undefined) {
			return makeCollection(checklists, this, value);
		} else {
			return stringifyCollection(this);
		}

	};

});