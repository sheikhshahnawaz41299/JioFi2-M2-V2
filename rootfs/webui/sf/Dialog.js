define("./Dialog", ["./Loading", "jquery-1.8.2.min.js"], function(a, b, c) {
    var d = (a("./Loading"),
    "ui_")
      , e = "ui_dialog_"
      , f = "_"
      , g = window.addEventListener ? '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><path d="M116.152,99.999l36.482-36.486c2.881-2.881,2.881-7.54,0-10.42 l-5.215-5.215c-2.871-2.881-7.539-2.881-10.42,0l-36.484,36.484L64.031,47.877c-2.881-2.881-7.549-2.881-10.43,0l-5.205,5.215 c-2.881,2.881-2.881,7.54,0,10.42l36.482,36.486l-36.482,36.482c-2.881,2.881-2.881,7.549,0,10.43l5.205,5.215 c2.881,2.871,7.549,2.871,10.43,0l36.484-36.488L137,152.126c2.881,2.871,7.549,2.871,10.42,0l5.215-5.215 c2.881-2.881,2.881-7.549,0-10.43L116.152,99.999z"/></svg>' : ""
      , h = "WebkitAppearance"in document.documentElement.style || "undefined" != typeof document.webkitHidden
      , i = function(a) {
        var b = {
            title: "",
            content: "",
            width: "auto",
            buttons: [],
            onShow: $.noop,
            onHide: $.noop,
            onRemove: $.noop,
            onClose: $.noop
        }
          , c = $.extend({}, b, a || {})
          , f = {};
        this.el = f,
        this.width = this.width,
        this.callback = {
            show: c.onShow,
            hide: c.onHide,
            remove: c.onRemove,
            close: c.onClose
        },
        f.container = window.addEventListener ? $('<dialog class="' + e + 'container"></dialog>') : $('<div class="' + e + 'container"></div>'),
        history.pushState && (typeof f.container.get(0).animation!="undefined") && f.container.get(0).addEventListener(h ? "webkitAnimationEnd" : "animationend", function(a) {
            "dialog" == a.target.tagName.toLowerCase() && this.classList.remove(e + "animation")
        }),
        f.dialog = $('<div class="' + d + 'dialog"></div>').css("width", c.width),
        f.title = $('<div class="' + e + 'title"></div>').html(c.title),
        f.close = $('<a href="javascript:" class="' + e + 'close"></a>').html(g).click($.proxy(function(a) {
        	$.isFunction(this.callback.close) && this.callback.close.call(this);
            this[this.closeMode](),
            a.preventDefault()
        }, this));
        var i = c.content;
        $.isFunction(i) && (i = i()),
        i.size ? this.closeMode = "hide" : this.closeMode = "remove",
        f.body = $('<div class="' + e + 'body"></div>')[i.size ? "append" : "html"](i),
        f.footer = $('<div class="' + e + 'footer"></div>'),
        this.button(c.buttons),
        f.container.append(f.dialog.append(f.close).append(f.title).append(f.body).append(f.footer)),
        document.querySelector || f.container.append('<i class="' + e + 'after"></i>');
        var j = $("." + e + "container");
        return j.size() ? j.eq(0).before(f.container.css({
            zIndex: 1 * j.eq(0).css("z-index") + 1
        })) : (c.container || $(document.body)).append(f.container),
        this.display = !1,
        c.content && this.show(),
        this
    }
    ;
    return i.prototype.button = function(a) {
        var b = this.el
          , c = this;
        return b.footer.empty(),
        $.each(a, function(a, e) {
            e = e || {};
            var g = a ? e.type || "" : e.type || "primary"
              , h = a ? e.value || "Cancel" : e.value || "OK"
              , i = e.events || {
                click: function() {
                	$.isFunction(e.callback) && e.callback.call(this);
                    c[c.closeMode]()
                }
            }
              , j = d + "button";
            g && (j = j + " " + j + f + g),
            b.footer.append(b["button" + a] = $('<a href="javascript:;" class="' + j + '">' + h + "</a>").bind(i))
        }),
        this
    }
    ,
    i.prototype.loading = function() {
        var a = this.el;
        return a && (a.container.attr("class", [e + "container", e + "loading"].join(" ")),
        a.body.loading(),
        this.show()),
        this
    }
    ,
    i.prototype.unloading = function(a) {
        var b = this.el;
        return b && (b.container.removeClass(e + "loading"),
        b.body.unloading(a)),
        this
    }
    ,
    i.prototype.open = function(a, b) {
        var c = this.el
          , d = {
            title: "",
            buttons: []
        }
          , f = $.extend({}, d, b || {});
        return c && a && (c.container.attr("class", [e + "container"].join(" ")),
        c.title.html(f.title),
        c.body.html(a),
        this.button(f.buttons).show()),
        this
    }
    ,
    i.prototype.alert = function(a, b) {
        var c = this.el
          , d = {
            title: "",
            type: "remind",
            buttons: [{}]
        }
          , f = $.extend({}, d, b || {});
        return f.buttons[0].type || "remind" == f.type || (f.buttons[0].type = f.type),
        c && a && (c.container.attr("class", [e + "container", e + "alert"].join(" ")),
        c.dialog.width((!-[1,]&&!window.XMLHttpRequest) ?"600px" :"auto"),
        c.title.html(f.title),
        c.body.html('<div class="' + e + f.type + '">' + a + "</div>"),
        this.button(f.buttons).show()),
        this
    }
    ,
    i.prototype.confirm = function(a, b) {
        var c = this.el
          , d = {
            title: "",
            type: "warning",
            buttons: [{
                type: "warning"
            }, {}]
        }
          , f = $.extend({}, d, b || {});
//        this.callback.remove.name=="noop"  && 
        $.isFunction(f.buttons[1].callback) && (this.callback.close = f.buttons[1].callback);
        return f.buttons.length && !f.buttons[0].type && (f.buttons[0].type = "warning"),
        c && a && (c.container.attr("class", [e + "container", e + "confirm"].join(" ")),
        c.dialog.width((!-[1,]&&!window.XMLHttpRequest) ?"600px" :"auto"),
        c.title.html(f.title),
        c.body.html('<div class="' + e + f.type + '">' + a + "</div>"),
        this.button(f.buttons).show()),
        this

    }
    ,
    i.prototype.ajax = function(a, b) {
        var c = this
          , d = (new Date).getTime()
          , e = {
            dataType: "JSON",
            timeout: 3e4,
            error: function(a, b) {
                var d = "<h6>尊敬的用户，很抱歉您刚才的操作没有成功！</h6>"
                  , e = "";
                e = "timeout" == b ? "<p>主要是由于请求时间过长，数据没能成功加载，这一般是由于网速过慢导致，您可以稍后重试！</p>" : "parsererror" == b ? "<p>原因是请求的数据含有不规范的内容。一般出现这样的问题是开发人员没有考虑周全，欢迎向我们反馈此问题！</p>" : "<p>一般是网络出现了异常，如断网；或是网络临时阻塞，您可以稍后重试！如依然反复出现此问题，欢迎向我们反馈！</p>",
                c.alert(d + e, {
                    type: "warning"
                }).unloading()
            }
        }
          , f = $.extend({}, e, a || {});
        if (!f.url)
            return this;
        var g = {
            title: "",
            content: function(a) {
                return "string" == typeof a ? a : "<i style=\"display:none\">看见我说明没使用'options.content'做JSON解析</i>"
            },
            buttons: []
        }
          , h = $.extend({}, g, b || {})
          , i = f.success;
        return f.success = function(a) {
            c.open(h.content(a), h),
            (new Date).getTime() - d < 100 ? c.unloading(0) : c.unloading(),
            $.isFunction(i) && i.apply(this, arguments)
        }
        ,
        c.loading(),
        setTimeout(function() {
            $.ajax(f)
        }, 250),
        this
    }
    ,
    i.prototype.scroll = function() {
        var a = $("." + e + "container")
          , b = !1;
        if (a.each(function() {
            "block" == $(this).css("display") && (b = !0)
        }),
        b) {
            var c = 17;
            1 != this.display && "number" == typeof window.innerWidth && (c = window.innerWidth - document.documentElement.clientWidth),
            document.documentElement.style.overflow = "hidden",
            1 != this.display && $(document.body).css("border-right", c + "px solid transparent")
        } else
            document.documentElement.style.overflow = "",
            $(document.body).css("border-right", "");
        return this
    }
    ,
    i.prototype.show = function() {
        var a = this.el.container;
//        a.css({"display": "block","positon":"absolute"});
        return a && (a.css({"display": "block","positon":"absolute"}),
        1 != this.display && a.addClass(e + "animation"),
        this.scroll(),
        this.display = !0,
        $.isFunction(this.callback.show) && this.callback.show.call(this, a)),
        this
    }
    ,
    i.prototype.hide = function() {
        var a = this.el.container;
        return a && (a.hide(),
        this.scroll(),
        this.display = !1,
        $.isFunction(this.callback.hide) && this.callback.hide.call(this, a)),
        this
    }
    ,
    i.prototype.remove = function(a) {
        var b = this.el.container;
        return b && (b.remove(),
        this.scroll(),
        this.display = !1,
        $.isFunction(this.callback.remove) && this.callback.remove.call(this, b)),
        this
    }
    ,
    i
});
