define("./Select", ["jquery-1.8.2.min.js"], function(a, b, c) {
    a("jquery-1.8.2.min.js"),
    $.fn.selectMatch = function(a) {
        var b = "select"
          , c = "selected"
          , d = "disabled"
          , e = "active"
          , f = "reverse"
          , g = {
            prefix: "ui_",
            trigger: ["change"]
        }
          , h = $.extend({}, g, a || {})
          , i = h.prefix + b
          , j = h.prefix.replace(/[a-z]/gi, "")
          , k = function(a) {
            var b = 0
              , e = "";
            return a.find("option").each(function(a) {
                var f = [i + j + "datalist" + j + "li", this.className];
                this[c] && (b = a,
                f.push(c)),
                this[d] && f.push(d),
                e = e + '<li class="' + f.join(" ") + '" data-index=' + a + ">" + this.innerHTML + "</li>"
            }),
            {
                index: b,
                html: e
            }
        }
        ;
        return $(this).each(function(a, g) {
            var l = $(this).hide().data(b);
            l || (l = $("<div></div>").on("click", "a", function() {
                if ($(g).prop(d))
                    return !1;

                if (l.toggleClass(e),
                l.hasClass(e)) {
                    var a = l.find("ul")
                      , b = a.offset().top + a.outerHeight() > Math.max($(document.body).height(), $(window).height());
                      a.css({"width":l.outerWidth(),"display":"block"});
                    l[b ? "addClass" : "removeClass"](f);
                    var h = l.data("scrollTop")
                      , i = a.find("." + c);
                    h && h[1] == i.attr("data-index") && h[2] == i.text() && (a.scrollTop(h[0]),
                    l.removeData("scrollTop"))
                } else{
                    l.removeClass(f);
                    l.find("ul").css("display","");
                }
            }).on("click", "li", function(a, b) {
                var d = $(this).attr("data-index")
                  , f = $(this).parent().scrollTop();
                l.removeClass(e),
                l.data("scrollTop", [f, d, $(this).text()]),
                $(g).find("option").eq(d).get(0)[c] = !0,
                $(g).selectMatch(h),
                $.each(h.trigger, function(a, c) {
                    $(g).trigger(c, [b])
                })
            }),
            $(this).data(b, l),
            $(this).after(l),
            $(document).mouseup(function(a) {
                var b = a.target;
                b && l.hasClass(e) && l.get(0) !== b && 0 == l.get(0).contains(b) && l.removeClass(e).removeClass(f) && l.find("ul").css("display","");
            }));
            var m = k($(this))
              , n = $(this).find("option").eq(m.index);
            l.attr("class", g.className + " " + i).width($(this).outerWidth());
            var o = '<a href="javascript:" class="' + i + j + 'button"><span class="' + i + j + 'text">' + n.html() + '</span><i class="' + i + j + 'icon"></i></a>'
              , p = '<ul class="' + i + j + 'datalist">' + m.html + "</ul>";
            l.html(p+o);

        })
    }
    ,
    c.exports = {
        init: function(a, b) {
            a = a || $("select"),
//            a=$("select"),
            a.selectMatch(b)
        }
    }
});
