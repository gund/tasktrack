/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file utils.js
 * @package js
 * @date 08.08.2013 18:35:32
 * @id $js-2013-utils.js$
 * utils.js - Special Class for work
 */

var Utils = {
	debug : APP_DEBUG,
	log : function(msg, level, showDate) {
		if (this.debug && msg !== undefined) {
			var prefix = '[DEBUG';
			if (showDate === true) {
				prefix += ' ' + (new Date().getTime());
			}
			prefix += '] ';
			msg = prefix + msg;
			switch (level) {
			case 'info':
				console.info(msg);
				break;
			case 'warn':
				console.warn(msg);
				break;
			case 'error':
				console.error(msg);
				break;
			case 'dir':
				console.dir(msg);
				break;
			default:
				console.log(msg);
				break;
			}
		}
	},
	getId : function() {
		do {
			var random = Math.ceil(Math.random() * 999);
		} while (random == 0);
		var timeStamp = new Date().getTime();
		var timeDelimiter = new Date().getMilliseconds();
		var id = Math.abs(timeStamp ^ (timeStamp * timeDelimiter)) * random;
		return id;
	},
	includeModules : function(modules) {
		for (var i in modules) {
			var module = modules[i];
			MODULE_PATH[module] = APP_MODULES+'/'+module;
			Utils.log('Include module: ' + module);
			document.write('<script type="text/javascript" src="' + APP_MODULES
					+ '/' + module + '/module.js"></script>');
		}
	},
	loop: function(func, interval) {
		(function() {
			func();
			setTimeout(arguments.callee, interval);
		})();
	}
};