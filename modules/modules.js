/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file modules.js
 * @package js
 * @date 08.08.2013 18:34:12
 * @id $js-2013-modules.js$
 * modules.js - Include module in the Application
 */

// Module Directory
const APP_MODULES = 'modules';
var MODULE_PATH = new Array();

// Modules
var appModules = ['windowtt', 'core_100', 'gh_buttons'];

//Include Modules
Utils.includeModules(appModules);