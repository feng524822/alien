/*!
 * index.js
 * @author ydr.me
 * @create 2014-10-04 02:33
 */


define(function (require, exports, module) {
    /**
     * 对话框
     * @module ui/dialog/index
     * @requires ui/drag/index
     */
    'use strict';

    require('./style.js');

    var klass = require('../../util/class.js');
    var drag = require('../drag/index.js');
    var modification = require('../../core/dom/modification.js');
    var selector = require('../../core/dom/selector.js');
    var position = require('../../core/dom/position.js');
    var attribute = require('../../core/dom/attribute.js');
    var animation = require('../../core/dom/animation.js');
    var event = require('../../core/event/touch.js');
    var data = require('../../util/data.js');
    var index = 0;
    var zIndex = 9999;
    var html = document.documentElement;
    var body = document.body;
    var overflowClass = 'alien-ui-dialog-overflow';
    var dialogClass = 'alien-ui-dialog';
    var bodyClass = 'alien-ui-dialog-body';
    var titleClass = 'alien-ui-dialog-title';
    var closeClass = 'alien-ui-dialog-close';
    var iframeClass = 'alien-ui-dialog-iframe';
    var shakeClass = 'alien-ui-dialog-shake';
    var noop = function () {
        // ignore
    };
    var defaults = {
        width: 500,
        height: 'auto',
        left: 'center',
        top: 'center',
        title: '无标题对话框',
        canDrag: !0,
        duration: 345,
        easing: 'ease-in-out-back',
        // 优先级2
        remote: null,
        remoteHeight: 400,
        // 优先级1
        content: null,
        // 优先级1
        isWrap: !0,
        onopen: noop,
        onclose: noop
    };
    // 打开的对话框队列
    var openDialogs = [];
    var dialogsMap = {};
    var Dialog = klass.create({
        /**
         * 对话框构造函数
         * @param {HTMLElement|Node} ele 元素
         * @param {Object} [options] 参数
         */
        constructor: function (ele, options) {
            this.ele = ele;
            this.options = options;
        },


        /**
         * 初始化
         * @returns {Dialog}
         * @private
         */
        _init: function () {
            index++;

            var the = this;
            var options = the.options;
            var bg = modification.create('div', {
                id: 'alien-ui-dialog-bg-' + index,
                'class': 'alien-ui-dialog-bg'
            });
            var dialog = modification.create('div', {
                id: 'alien-ui-dialog-' + index,
                'class': dialogClass,
                role: 'dialog'
            });
            var bd;


            if (options.isWrap) {
                dialog.innerHTML = '<div class="alien-ui-dialog-container">' +
                    (options.title === null ? '' :
                        '<div class="alien-ui-dialog-header">' +
                        '<div class="' + titleClass + '">' + options.title + '</div>' +
                        '<div class="' + closeClass + '">&times;</div>' +
                        '</div>') +
                    '<div class="' + bodyClass + '"></div>' +
                    '</div>';
                bd = selector.query('.' + bodyClass, dialog)[0];
            }

            modification.insert(bg, body, 'beforeend');
            modification.insert(dialog, bg, 'beforeend');
            the.bg = bg;

            the.dialog = dialog;
            the.hasOpen = !1;
            the.zIndex = 0;
            the.id = index;
            dialogsMap[the.id] = the;

            if (options.title !== null && options.canDrag && options.isWrap) {
                drag(dialog, {
                    handle: '.' + titleClass,
                    zIndex: the.zIndex
                });
            }

            modification.insert(the.ele, bd ? bd : dialog, 'beforeend');

            event.on(dialog, 'click tap', '.' + closeClass, function () {
                the.close();
            });

            event.on(the.bg, 'click tap', function (eve) {
                eve.stopPropagation();

                if (!selector.closest(eve.target, '.' + dialogClass).length) {
                    the._shake();
                }
            });

            return the;
        },


        /**
         * 打开对话框
         * @param {Function} [callback] 打开之后回调
         * @returns {Dialog}
         */
        open: function (callback) {
            callback = callback || noop;

            var winW = position.width(window);
            var winH = position.height(window);
            var the = this;
            var bg = the.bg;
            var dialog = the.dialog;
            var to;
            var options = the.options;
            var findIndex;

            if (the.hasOpen) {
                return the;
            }

            the.hasOpen = !0;
            findIndex = openDialogs.indexOf(the.id);

            if(findIndex > -1){
                openDialogs.splice(findIndex, 1);
            }

            openDialogs.push(the.id);
            attribute.addClass(html, overflowClass);
            attribute.addClass(body, overflowClass);

            if (options.content || options.remote) {
                the.ele.innerHTML = '';
            }

            attribute.css(bg, {
                display: 'block',
                zIndex: ++zIndex,
                opacity: 0
            });

            attribute.css(dialog, {
                display: 'block',
                visibility: 'hidden',
                width: options.width,
                height: options.height
            });

            the.zIndex = zIndex;
            to = the._position();
            to.opacity = '';

            attribute.css(dialog, {
                opacity: 0,
                visibility: 'visible',
                width: 0,
                height: 0,
                left: winW / 2,
                top: winH * 2 / 5
            });

            animation.animate(bg, {
                opacity: 1
            }, {
                duration: options.duration,
                easing: options.easing
            });

            animation.animate(dialog, to, {
                duration: options.duration,
                easing: options.easing
            }, function () {
                options.onopen.call(dialog);

                if (!options.content && options.remote) {
                    the.setRemote(options.remote);
                }

                if(data.type(callback) === 'function'){
                    callback.call(the);
                }
            });

            if (options.content) {
                the.setContent(options.content);
            }

            return the;
        },


        /**
         * 关闭对话框
         * @param {Function} [callback] 打开之后回调
         * @returns {Dialog}
         */
        close: function (callback) {
            var the = this;
            var bg = the.bg;
            var dialog = the.dialog;
            var options = the.options;
            var theW = position.width(dialog);
            var theH = position.height(dialog);
            var theL = position.left(dialog);
            var theT = position.top(dialog);

            if (!the.hasOpen) {
                return the;
            }

            the.hasOpen = !1;
            openDialogs.pop();

            if (!openDialogs.length) {
                attribute.removeClass(html, overflowClass);
                attribute.removeClass(body, overflowClass);
            }

            animation.animate(dialog, {
                opacity: 0,
                width: 0,
                height: 0,
                left: theL + theW / 2,
                top: theT + theH / 2
            }, {
                duration: options.duration,
                easing: options.easing
            });

            animation.animate(bg, {
                opacity: 0
            }, {
                duration: options.duration,
                easing: options.easing
            }, function () {
                attribute.css(bg, 'display', 'none');
                options.onclose.call(dialog);

                if(data.type(callback) === 'function'){
                    callback.call(the);
                }
            });

            return the;
        },


        /**
         * 重新定位对话框
         * @param {Function} [callback] 打开之后回调
         * @returns {Dialog}
         */
        position: function (callback) {
            var the = this;
            var options = the.options;
            var pos = the._position();

            animation.animate(the.dialog, pos, {
                duration: options.duration,
                easing: options.easing
            }, function () {
                if(data.type(callback) === 'function'){
                    callback.call(the);
                }
            });

            return the;
        },


        /**
         * 对话框添加内容，并重新定位
         * @private
         */
        setContent: function (content) {
            var the = this;
            var contentType = data.type(content);

            the.ele.innerHTML = '';

            if (contentType === 'string') {
                content = modification.create('#text', content);
            }

            modification.insert(content, the.ele, 'beforeend');
            the.position();

            return the;
        },


        /**
         * 对话框添加远程地址，并重新定位
         * @param {String} url 远程地址
         * @param {Number} [height=400] 高度
         * @private
         */
        setRemote: function (url, height) {

            var the = this;
            var options = the.options;
            var iframe = modification.create('iframe', {
                src: url,
                'class': iframeClass,
                style: {
                    height: height || options.remoteHeight
                }
            });

            the.ele.innerHTML = '';
            modification.insert(iframe, the.ele, 'beforeend');
            the.position();

            return the;
        },


        /**
         * 销毁对话框
         * @param {Function} [callback] 打开之后回调
         */
        destroy: function (callback) {
            var the = this;

            // 关闭对话框
            the.close(function () {
                // 从对话框 map 里删除
                delete(dialogsMap[the.id]);

                // 将内容放到 body 里
                modification.insert(the.ele, body, 'beforeend');

                // 在 DOM 里删除
                modification.remove(the.bg);

                // 设置当前实例为 null
                the = null;

                if(data.type(callback) === 'function'){
                    callback.call(the);
                }
            });
        },


        /**
         * 获取对话框需要定位的终点位置
         * @returns {Object}
         * @type {{width:Number,height:Number,left:Number,top:Number}}
         * @private
         */
        _position: function () {
            var the = this;
            var options = the.options;
            var winW = position.width(window);
            var winH = position.height(window);
            var pos = {};

            animation.stop(the.dialog, !0);

            attribute.css(the.dialog, {
                width: options.width,
                height: options.height
            });

            pos.width = position.width(the.dialog);
            pos.height = position.height(the.dialog);

            if (options.left === 'center') {
                pos.left = (winW - pos.width) / 2;
                pos.left = pos.left < 0 ? 0 : pos.left;
            } else {
                pos.left = options.left;
            }

            if (options.top === 'center') {
                pos.top = (winH - pos.height) * 2 / 5;
                pos.top = pos.top < 0 ? 0 : pos.top;
            } else {
                pos.top = options.top;
            }

            return pos;
        },





        /**
         * 晃动对话框以示提醒
         * @private
         */
        _shake: function () {
            var the = this;

            if (the.shakeTimeid) {
                the.shakeTimeid = 0
                clearTimeout(the.shakeTimeid);
                attribute.removeClass(the.dialog, shakeClass);
            }

            attribute.addClass(the.dialog, shakeClass);

            the.shakeTimeid = setTimeout(function () {
                attribute.removeClass(the.dialog, shakeClass);
            }, 500);
        }
    });


    event.on(document, 'keyup', function (eve) {
        var d;

        if(eve.which === 27 && openDialogs.length){
            d = dialogsMap[openDialogs[openDialogs.length - 1]];

            if(d && d.constructor === Dialog){
                d._shake();
            }
        }
    });

    /**
     * 对话框，自动实例化
     * @param ele {HTMLElement|Node} 元素
     * @param [options] {Object}
     * @param [options.width=500] {Number|String} 对话框宽度
     * @param [options.height="auto"] {Number|String} 对话框高度
     * @param [options.left="center"] {Number|String} 对话框左距离，默认水平居中
     * @param [options.top="center"] {Number|String} 对话框上距离，默认垂直居中（为了美观，表现为2/5处）
     * @param [options.title="无标题对话框"] {String|null} 对话框标题，为null时将隐藏标题栏
     * @param [options.canDrag=true] {Boolean} 对话框是否可以被拖拽，当有标题栏存在的时候
     * @param [options.duration=345] {Number} 对话框打开、关闭的动画时间
     * @param [options.easing="ease-in-out-back"] {String} 对话框打开、关闭的动画缓冲函数
     * @param [options.remote=null] {null|String} 对话框打开远程地址，优先级2
     * @param [options.remoteHeight=400] {Number} 对话框打开远程地址的高度
     * @param [options.content=null] {null|HTMLElement|Node|String} 设置对话框的内容，优先级1
     * @param [options.isWrap=true] {Boolean} 是否自动包裹对话框来，默认 true，优先级1
     * @param [options.onopen] {Function} 对话框打开时回调
     * @param [options.onclose] {Function} 对话框关闭时回调
     * @returns {Dialog}
     *
     * @example
     * var d1 = dialog(ele, options);
     */
    module.exports = function (ele, options) {
        options = data.extend(!0, {}, defaults, options);

        return (new Dialog(ele, options))._init();
    };
});