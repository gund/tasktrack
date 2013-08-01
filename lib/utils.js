/**
 * @author Алексей
 * @project tasktrack
 * @date 01.08.2013 19:20:44
 * 
 * $jquery.js$ Special function for work
 * 
 */

var Util = {
	debug : true,
	log : function(msg, level, showDate) {
		if (this.debug && msg !== undefined) {
			var prefix = '[DEBUG';
			if (showDate === true) {
				prefix += ' '+(new Date().getTime());
			}
			prefix += '] ';
			msg = prefix+msg;
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
	}
};