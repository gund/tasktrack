/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file main.js
 * @package js
 * @date 08.08.2013 18:34:12
 * @id $js-2013-main.js$
 * main.js - Main JavaScript Application
 */

$(document).ready(function() {
	Utils.log('DOM is ready!');
	onLoadApp();
	var myWindow = new WindowTT;
	myWindow.construct({
		title: 'Lol',
		html: 'My simple content',
		modal: true
	});
	(function() {
//		myWindow.toggle();
//		setTimeout(arguments.callee, 1000);
	})();
});

function onLoadApp() {
	$('#app-loading').css('display','none');
	/*var currTime = 0;
	Utils.loop(function() {
		if (currTime > 5) {
			$('#app-loading').css('display','none');
		}
		currTime++;
	}, 300);*/
}