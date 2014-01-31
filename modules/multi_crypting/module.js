/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file module.js
 * @package js
 * @date 16.01.2014 15:34:43
 * @id $js-2013-module.js$
 * module.js - Include Module Multi Crypting
 */

const MULTI_CRYPTING = 'multi_crypting';

if (APP_DEBUG) {
    // Include JS
    document.write('<script type="text/javascript" src="' + MODULE_PATH[MULTI_CRYPTING] + '/js/class.mc.js"></script>');
} else {
    //document.write('<script type="text/javascript" src="' + MODULE_PATH[MULTI_CRYPTING] + '/js/class.mc.min.js"></script>');
}