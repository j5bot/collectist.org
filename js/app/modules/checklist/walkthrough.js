define([
	'jquery',
	'plugins/jquery.classywiggle'
], function ($) {

	function showWalkthrough(callback) {
		var step = 0;

		function nextWalkthrough() {
			var $step = $('.walkthrough-step' + step);

			if ($step.size() > 0) {
				$step.ClassyWiggle('stop').hide();
			}

			step++;
			$step = $('.walkthrough-step' + step);

			if ($step.size() > 0) {
				$step.show().ClassyWiggle('start', { delay: 100 }).click(nextWalkthrough);
			} else {
				callback();
			}
		}

		nextWalkthrough();
	}

	return showWalkthrough;

});