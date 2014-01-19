/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file module.js
 * @package js
 * @date 16.01.2014 15:34:43
 * @id $js-2013-module.js$
 * module.js - Include Module Mcrypt
 */

const MODULE_MCRYPT = 'js_mcrypt';

// Include JS
document.write('<script type="text/javascript" src="'+MODULE_PATH[MODULE_MCRYPT]+'/js/utf8.js"></script>');
document.write('<script type="text/javascript" src="'+MODULE_PATH[MODULE_MCRYPT]+'/js/rijndael.js"></script>');
document.write('<script type="text/javascript" src="'+MODULE_PATH[MODULE_MCRYPT]+'/js/Serpent.js"></script>');
document.write('<script type="text/javascript" src="'+MODULE_PATH[MODULE_MCRYPT]+'/js/mcrypt.js"></script>');