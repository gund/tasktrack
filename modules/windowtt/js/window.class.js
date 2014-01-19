/**
 * @author Alex Malkevich
 * @project tasktrack
 * @file window.class.js
 * @package js
 * @date 08.08.2013 18:34:12
 * @id $js-2013-window.class.js$
 *
 * window.class.js - Window Class
 */

// Default Constants
const DEF_WIDTH = 400;
const DEF_HEIGHT = 200;
const DEF_MODAL = false;
const DEF_SHOW_SPEED = 400;
const DEF_HIDE_SPEED = DEF_SHOW_SPEED / 2;

function WindowTT(settings) {
    this.title = (settings.title !== undefined) ? settings.title : '';
    this.html = (settings.html !== undefined) ? settings.html : '';

    this.width = (settings.width !== undefined) ? parseInt(settings.width)
        : DEF_WIDTH;
    this.height = (settings.height !== undefined) ? parseInt(settings.height)
        : DEF_HEIGHT;
    this.max_height = (settings.max_height !== undefined) ? parseInt(settings.max_height)
        : 0;
    this.modal = (settings.modal !== undefined) ? (settings.modal == true)
        : DEF_MODAL;
    this.showSpeed = (settings.showSpeed !== undefined) ? parseInt(settings.showSpeed)
        : DEF_SHOW_SPEED;
    this.hideSpeed = (settings.hideSpeed !== undefined) ? parseInt(settings.hideSpeed)
        : DEF_HIDE_SPEED;
    this.closeAble = (settings.closeAble !== undefined) ? !!settings.closeAble : true;

    this.bodyCtx = document.body;
    this.windowId = Utils.getId();

    this.init();
    this.windowState = 1;

    return this;
}

// Window Properties
WindowTT.prototype.title = '';
WindowTT.prototype.html = '';
WindowTT.prototype.width = 0;
WindowTT.prototype.height = 0;
WindowTT.prototype.max_height = 0;
WindowTT.prototype.modal = DEF_MODAL;
WindowTT.prototype.bodyCtx = new Object();
WindowTT.prototype.windowCtx = new Object();
WindowTT.prototype.modalCtx = new Object();
WindowTT.prototype.windowTitle = new Object();
WindowTT.prototype.windowCloseBtn = new Object();
WindowTT.prototype.windowHtml = new Object();
WindowTT.prototype.windowId = 0;
WindowTT.prototype.closeAble = true;
/**
 * Window State: 0 - Not Initialized; 1 - Hidden; 2 - Shown
 */
WindowTT.prototype.windowState = 0;


WindowTT.prototype.init = function () {
    if (this.windowState == 0) {
        if (this.modal) {
            // Init Modal
            var modalElemet = document.createElement('div');
            modalElemet.setAttribute('id', 'win-modal-' + this.windowId);
            modalElemet.setAttribute('class', 'window-modal');
            modalElemet.setAttribute('style', 'opacity:0;display:none;');
            this.bodyCtx.appendChild(modalElemet);
            this.modalCtx = $('#win-modal-' + this.windowId);
        }
        // Init Window
        var windowClass = (this.modal) ? ' modal' : '';
        var windowElement = document.createElement('div');
        var tmpWidth = 'left:calc((100%/2) - ' + (this.width / 2) + 'px)';
        var tmpHeight = 'top:calc((100%/2) - ' + (((this.max_height != 0) ? this.max_height : this.height) / 2) + 'px)';
        windowElement.setAttribute('id', 'window-' + this.windowId);
        windowElement.setAttribute('class', 'window-window' + windowClass);
        var height = (this.max_height != 0) ?
            'max-height:' + this.max_height + 'px;min-height:' + this.height + 'px' : 'height:' + this.height + 'px';
        windowElement.setAttribute('style', 'opacity:0;display:none;width:'
            + this.width + 'px;' + height + ';' + tmpHeight + ';' + tmpWidth);
        /*
         * windowElement.setAttribute('width', this.width + 'px');
         * windowElement.setAttribute('height', this.height + 'px');
         */
        this.bodyCtx.appendChild(windowElement);
        this.windowCtx = $('#window-' + this.windowId);
        // Init Window Title
        var windowTitle = document.createElement('div');
        windowTitle.setAttribute('class', 'window-title');
        windowTitle.innerHTML = this.title;
//					+ '<span class="window-close"></span>';
        var wnd = this;
        // Create close button
        if (this.closeAble) {
            var windowCloseBtn = document.createElement('span');
            windowCloseBtn.setAttribute('class', 'window-close');
            windowCloseBtn.addEventListener('click', function (event) {
                wnd.close();
            });
            this.windowCloseBtn = windowCloseBtn;
            windowTitle.appendChild(windowCloseBtn);
        }
        this.windowCtx.append(windowTitle);
        this.windowTitle = $('#window-' + this.windowId + ' .window-title');
        // Init Window HTML
        var windowHTML = document.createElement('div');
        windowHTML.setAttribute('class', 'window-html');
        var height = (this.max_height != 0) ?
            'max-height:' + (this.max_height - 32) : 'height:' + (this.height - 32);
        windowHTML.setAttribute('style', height + 'px;overflow:auto;overflow-x:hidden;');
        windowHTML.innerHTML = this.html;
        this.windowHtml = windowHTML;
        this.windowCtx.append(windowHTML);
        this.windowHTML = $('#window-' + this.windowId + ' .window-html');

        // Onclose Event
//			$('#window-' + this.windowId + ' .window-title .window-close').on('click', this.close());
    }
};

// Getters&Setters
WindowTT.prototype.setTitle = function (title) {
    this.title = (title !== undefined) ? title : '';
    this.windowTitle.html(this.title);
    if (this.closeAble)
        this.windowTitle.append(this.windowCloseBtn)
};

WindowTT.prototype.getTitle = function () {
    return this.title;
};

WindowTT.prototype.setHtml = function (html) {
    this.html = (html !== undefined) ? html : '';
    this.windowHtml.innerHTML = this.html;
};

WindowTT.prototype.getHtml = function () {
    return this.html;
};

WindowTT.prototype.setModal = function (modal) {
    this.modal = (modal !== undefined) ? (modal == true) : DEF_MODAL;
};

WindowTT.prototype.getModal = function () {
    return this.modal;
}

// Manipulate Window State
WindowTT.prototype.show = function () {
    Utils.log('Window show');
    if (this.windowState === 1) {
        if (this.modal) {
            // this.modalCtx.css('display', '');
            this.modalCtx.stop().animate({
                opacity: 0.5
            }, this.showSpeed).css('display', '');
        }
        this.windowCtx.stop().animate({
            opacity: 1
        }, this.showSpeed).css('display', '');
    }
    this.windowState = 2;

    return this;
};

WindowTT.prototype.close = function () {
    Utils.log('Window close');
    if (this.windowState === 2) {
        if (this.modal) {
            // this.modalCtx.css('display', 'none');
            var modalCtx = this.modalCtx;
            this.modalCtx.stop().animate({
                opacity: 0
            }, this.hideSpeed, function () {
                modalCtx.css('display', 'none');
            });
        }
        var windowCtx = this.windowCtx;
        this.windowCtx.stop().animate({
            opacity: 0
        }, this.hideSpeed, function () {
            windowCtx.css('display', 'none');
        });
    }
    this.windowState = 1;

    return this;
};

WindowTT.prototype.toggle = function () {
    if (this.windowState === 1) {
        this.show();
    } else if (this.windowState === 2) {
        this.close();
    }

    return this;
};