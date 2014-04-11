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
    debug: APP_DEBUG,
    log: function (msg) {
        if (this.debug && msg !== undefined) {
            var prefix = '[DEBUG] ';
            console.info(prefix, arguments);
        }
    },
    getId: function () {
        do {
            var random = Math.ceil(Math.random() * 999);
        } while (random == 0);
        var timeStamp = new Date().getTime();
        var timeDelimiter = new Date().getMilliseconds();
        return Math.abs(timeStamp ^ (timeStamp * timeDelimiter)) * random;
    },
    includeModules: function (modules) {
        for (var i in modules) {
            var module = modules[i];
            MODULE_PATH[module] = APP_MODULES + '/' + module;
            Utils.log('Include module: ' + module);
            document.write('<script type="text/javascript" src="' + APP_MODULES
                + '/' + module + '/module.js"></script>');
        }
    },
    loop: function (func, interval) {
        (function () {
            func();
            setTimeout(arguments.callee, interval);
        })();
    },
    rand: function (min, max) {
        min = parseInt(min);
        max = parseInt(max);
        if (max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            return Math.floor(Math.random() * (min + 1));
        }
    },
    bin2hex: function (str) {
        var out = '';
        for (var i = str.length - 1; i >= 0; --i)
            out = hexdigits[str.charCodeAt(i) >> 4] + hexdigits[str.charCodeAt(i) & 15] + out;
        return out;
    },
    hex2bin: function (str) {
        var out = '';
        var part = -1;
        for (var i = 0; i < str.length; i++) {
            var t = hexLookup[str.charCodeAt(i)]
            if (t > -1) {
                if (part > -1) {
                    out += String.fromCharCode(part | t);
                    part = -1;
                } else
                    part = t << 4;
            }
        }
        return out;
    }
};

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

var hexdigits = '0123456789abcdef';
var hexLookup = Array(256);
for (var i = 0; i < 256; i++)
    hexLookup[i] = hexdigits.indexOf(String.fromCharCode(i));
