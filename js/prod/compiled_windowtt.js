var DEF_WIDTH=400,DEF_HEIGHT=200,DEF_MODAL=!1,DEF_SHOW_SPEED=400,DEF_HIDE_SPEED=DEF_SHOW_SPEED/2;
function WindowTT(c){this.title=void 0!==c.title?c.title:"";this.html=void 0!==c.html?c.html:"";this.width=void 0!==c.width?parseInt(c.width):DEF_WIDTH;this.height=void 0!==c.height?parseInt(c.height):DEF_HEIGHT;this.max_height=void 0!==c.max_height?parseInt(c.max_height):0;this.modal=void 0!==c.modal?!0==c.modal:DEF_MODAL;this.showSpeed=void 0!==c.showSpeed?parseInt(c.showSpeed):DEF_SHOW_SPEED;this.hideSpeed=void 0!==c.hideSpeed?parseInt(c.hideSpeed):DEF_HIDE_SPEED;this.closeAble=void 0!==c.closeAble?
!!c.closeAble:!0;this.bodyCtx=document.body;this.windowId=Utils.getId();this.init();this.windowState=1;return this}WindowTT.prototype.title="";WindowTT.prototype.html="";WindowTT.prototype.width=0;WindowTT.prototype.height=0;WindowTT.prototype.max_height=0;WindowTT.prototype.modal=DEF_MODAL;WindowTT.prototype.bodyCtx={};WindowTT.prototype.windowCtx={};WindowTT.prototype.modalCtx={};WindowTT.prototype.windowTitle={};WindowTT.prototype.windowCloseBtn={};WindowTT.prototype.windowHtml={};
WindowTT.prototype.windowId=0;WindowTT.prototype.closeAble=!0;WindowTT.prototype.windowState=0;
WindowTT.prototype.init=function(){if(0==this.windowState){if(this.modal){var c=document.createElement("div");c.setAttribute("id","win-modal-"+this.windowId);c.setAttribute("class","window-modal");c.setAttribute("style","opacity:0;display:none;");this.bodyCtx.appendChild(c);this.modalCtx=$("#win-modal-"+this.windowId)}var e=this.modal?" modal":"",c=document.createElement("div"),l="left:calc((100%/2) - "+this.width/2+"px)",h="top:calc((100%/2) - "+(0!=this.max_height?this.max_height:this.height)/2+
"px)";c.setAttribute("id","window-"+this.windowId);c.setAttribute("class","window-window"+e);e=0!=this.max_height?"max-height:"+this.max_height+"px;min-height:"+this.height+"px":"height:"+this.height+"px";c.setAttribute("style","opacity:0;display:none;width:"+this.width+"px;"+e+";"+h+";"+l);this.bodyCtx.appendChild(c);this.windowCtx=$("#window-"+this.windowId);c=document.createElement("div");c.setAttribute("class","window-title");c.innerHTML=this.title;var t=this;this.closeAble&&(l=document.createElement("span"),
l.setAttribute("class","window-close"),l.addEventListener("click",function(c){t.close()}),this.windowCloseBtn=l,c.appendChild(l));this.windowCtx.append(c);this.windowTitle=$("#window-"+this.windowId+" .window-title");c=document.createElement("div");c.setAttribute("class","window-html");e=0!=this.max_height?"max-height:"+(this.max_height-32):"height:"+(this.height-32);c.setAttribute("style",e+"px;overflow:auto;overflow-x:hidden;");c.innerHTML=this.html;this.windowHtml=c;this.windowCtx.append(c);this.windowHTML=
$("#window-"+this.windowId+" .window-html")}};WindowTT.prototype.setTitle=function(c){this.title=void 0!==c?c:"";this.windowTitle.html(this.title);this.closeAble&&this.windowTitle.append(this.windowCloseBtn)};WindowTT.prototype.getTitle=function(){return this.title};WindowTT.prototype.setHtml=function(c){this.html=void 0!==c?c:"";this.windowHtml.innerHTML=this.html};WindowTT.prototype.getHtml=function(){return this.html};WindowTT.prototype.setModal=function(c){this.modal=void 0!==c?!0==c:DEF_MODAL};
WindowTT.prototype.getModal=function(){return this.modal};WindowTT.prototype.show=function(){Utils.log("Window show");1===this.windowState&&(this.modal&&this.modalCtx.stop().animate({opacity:0.5},this.showSpeed).css("display",""),this.windowCtx.stop().animate({opacity:1},this.showSpeed).css("display",""));this.windowState=2;return this};
WindowTT.prototype.close=function(){Utils.log("Window close");if(2===this.windowState){if(this.modal){var c=this.modalCtx;this.modalCtx.stop().animate({opacity:0},this.hideSpeed,function(){c.css("display","none")})}var e=this.windowCtx;this.windowCtx.stop().animate({opacity:0},this.hideSpeed,function(){e.css("display","none")})}this.windowState=1;return this};WindowTT.prototype.toggle=function(){1===this.windowState?this.show():2===this.windowState&&this.close();return this};