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
var appModules = ['windowtt', 'js_base64', 'multi_crypting', 'js_mcrypt', 'core', 'gh_buttons'];

//Include Modules
Utils.includeModules(appModules);