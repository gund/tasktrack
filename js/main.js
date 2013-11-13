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
});

function onLoadApp() {
	$('#app-loading-bg').stop().animate({
        opacity: 0
    }, 500, function() {
        $(this).css('display','none');
    });
    var myWindow = new WindowTT({
        title: 'Lol',
        html: 'My simple content',
        modal: true
    });
    (function() {
//		myWindow.toggle();
//		setTimeout(arguments.callee, 1000);
    })();
}