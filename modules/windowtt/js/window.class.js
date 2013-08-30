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

var WindowTT = function() {
	// Default Constants
	const
	DEF_WIDTH = 400;
	const
	DEF_height = 200;
	const
	DEF_MODAL = false;
	const
	DEF_SHOW_SPEED = 400;
	const
	DEF_HIDE_SPEED = DEF_SHOW_SPEED / 2;

	// Window Properties
	this.title = '';
	this.html = '';
	this.width = 0;
	this.height = 0;
	this.modal = DEF_MODAL;
	this.bodyCtx = new Object();
	this.windowCtx = new Object();
	this.modalCtx = new Object();
	this.windowTitle = new Object();
	this.windowId = 0;
	/**
	 * Window State: 0 - Not Initialized; 1 - Hidden; 2 - Shown
	 */
	this.windowState = 0;

	this.construct = function(settings) {
		this.title = (settings.title !== undefined) ? settings.title : '';
		this.html = (settings.html !== undefined) ? settings.html : '';

		this.width = (settings.width !== undefined) ? parseInt(settings.width)
				: DEF_WIDTH;
		this.height = (settings.height !== undefined) ? parseInt(settings.height)
				: DEF_height;
		this.modal = (settings.modal !== undefined) ? (settings.modal == true)
				: DEF_MODAL;
		this.showSpeed = (settings.showSpeed !== undefined) ? parseInt(settings.showSpeed)
				: DEF_SHOW_SPEED;
		this.hideSpeed = (settings.hideSpeed !== undefined) ? parseInt(settings.hideSpeed)
				: DEF_HIDE_SPEED;

		this.bodyCtx = document.body;
		this.windowId = Utils.getId();

		this.init();
		this.windowState = 1;

		return this;
	};

	this.init = function() {
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
			var tmpWidth = 'left:calc((100%/2) - '+(this.width/2)+'px)';
			var tmpHeight = 'top:calc((100%/2) - '+(this.height/2)+'px)';
			windowElement.setAttribute('id', 'window-' + this.windowId);
			windowElement.setAttribute('class', 'window-window' + windowClass);
			windowElement.setAttribute('style', 'opacity:0;display:none;width:'
					+ this.width + 'px;height:' + this.height + 'px;'+tmpHeight+';'+tmpWidth);
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
			// Create close button
			var windowCloseBtn = document.createElement('span');
			windowCloseBtn.setAttribute('class', 'window-close');
			var wnd = this;
			windowCloseBtn.addEventListener('click', function(event) {wnd.close();});
			windowTitle.appendChild(windowCloseBtn);
			this.windowCtx.append(windowTitle);
			this.windowTitle = $('#window-' + this.windowId + ' .window-title');
			// Init Window HTML
			var windowHTML = document.createElement('div');
			windowHTML.setAttribute('class', 'window-html');
			windowHTML.innerHTML = this.html;
			this.windowCtx.append(windowHTML);
			this.windowHTML = $('#window-' + this.windowId + ' .window-html');

			// Onclose Event
//			$('#window-' + this.windowId + ' .window-title .window-close').on('click', this.close());
		}
	};

	// Getters&Setters
	this.setTitle = function(title) {
		this.title = (title !== undefined) ? title : '';
	};

	this.getTitle = function() {
		return this.title;
	};

	this.setHtml = function(html) {
		this.html = (html !== undefined) ? html : '';
	};

	this.getHtml = function() {
		return this.html;
	};

	this.setModal = function(modal) {
		this.modal = (modal !== undefined) ? (modal == true) : DEF_MODAL;
	};

	this.getModal = function() {
		return this.modal;
	}

	// Manipulate Window State
	this.show = function(modal) {
		Utils.log('Window show');
		if (this.windowState === 1) {
			if (this.modal) {
				// this.modalCtx.css('display', '');
				this.modalCtx.animate({
					opacity : 0.5
				}, this.showSpeed).css('display', '');
			}
			this.windowCtx.animate({
				opacity : 1
			}, this.showSpeed).css('display', '');
		}
		this.windowState = 2;

		return this;
	};

	this.close = function(modal) {
		Utils.log('Window close');
		if (this.windowState === 2) {
			if (this.modal) {
				// this.modalCtx.css('display', 'none');
				var modalCtx = this.modalCtx;
				this.modalCtx.animate({
					opacity : 0
				}, this.hideSpeed, function() {
					modalCtx.css('display', 'none');
				});
			}
			var windowCtx = this.windowCtx;
			this.windowCtx.animate({
				opacity : 0
			}, this.hideSpeed, function() {
				windowCtx.css('display', 'none');
			});
		}
		this.windowState = 1;

		return this;
	};

	this.toggle = function() {
		if (this.windowState === 1) {
			this.show();
		} else if (this.windowState === 2) {
			this.close();
		}

		return this;
	};
};