/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file class.mc.js
 * @package js
 * @date 16.01.2014 15:46:14
 * @id $js-2013-class.mc.js$
 *
 * class.mc.js - Multi Crypting Class
 */

var MultiCrypting = MultiCrypting ? MultiCrypting : new function () {

    /* Constants */

    const MCRYPT_RIJNDAEL_256 = 'rijndael-256';
    const MCRYPT_MODE_ECB = 'ecb';

    this.encode = function (text) {
        text = Utf8.fromCp1251(text);
        var iv_size = mcrypt.get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
        var iv = mcrypt.create_iv(iv_size);
        var key = generateKey();
        var result = mcrypt.Encrypt(text, iv, key.key, MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
        return prepareResult(result, key.time);
    };

    /* Private Methods */

    function generateKey(size) {
        if (size === undefined || (size != 16 && size != 32))
            size = 32;
        var d = (new Date()).getTime().toString();
        var keyH = "";
        for (var i = 6; i >= 0; --i) {
            // Get High byte
            keyH += (d[12 - i] ^ d[7 - i]).toString().substr(0, 1);
        }
        var tmp = Math.abs(d >> 3).toString();
        var key = tmp + keyH;
        if (size == 32) {
            key = Utils.bin2hex(key);
        }
        return {key: key, time: d};
    }

    function prepareResult(text, time) {
        text = Utils.bin2hex(text);
        time = Utils.bin2hex(time);
        return Base64.encode(time + text);
    }

};