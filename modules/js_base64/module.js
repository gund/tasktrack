/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file module.js
 * @package js
 * @date 16.01.2014 11:20:13
 * @id $js-2013-module.js$
 * module.js - Include Module Base64
 */

const MODULE_BASE64 = 'js_base64';

if (APP_DEBUG) {
    // Include JS
    document.write('<script type="text/javascript" src="' + MODULE_PATH[MODULE_BASE64] + '/js/class.base64.js"></script>');
} else {
    //document.write('<script type="text/javascript" src="' + MODULE_PATH[MODULE_BASE64] + '/js/class.base64.min.js"></script>');
}