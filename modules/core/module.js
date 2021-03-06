/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file module.js
 * @package js
 * @date 13.11.2013 15:03:10
 * @id $js-2013-module.js$
 * module.js - Include Core Module v.1.0.1
 */

// Module Name
const MODULE_CORE = 'core';

if (APP_DEBUG) {
    // Include JS
    document.write('<script type="text/javascript" src="' + MODULE_PATH[MODULE_CORE] + '/js/core.class.js"></script>');
    document.write('<script type="text/javascript" src="' + MODULE_PATH[MODULE_CORE] + '/js/dbAdapter.class.js"></script>');
} else {
    //document.write('<script type="text/javascript" src="' + MODULE_PATH[MODULE_CORE] + '/js/core.class.min.js"></script>');
    //document.write('<script type="text/javascript" src="' + MODULE_PATH[MODULE_CORE] + '/js/dbAdapter.class.min.js"></script>');
}