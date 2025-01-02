define("./Radio", ["jquery-1.8.2.min.js"], function(a, b, c) {
    a("jquery-1.8.2.min.js");
    var d = "checked";
    $.fn.propMatch = function() {
        if (!window.addEventListener) {
            if($.browser.msie && parseInt($.browser.version)<8){
                var r=function(o,p,q){
                    if((p==0 && q) || (p>0 &&!q)) {
                        o.eq(0).css("background-position","0 -40px");
                        o.eq(1).css("background-position","0 0");
                    }else{
                        o.eq(0).css("background-position","0 0");
                        o.eq(1).css("background-position","0 -40px");
                    }
                }

                var a = function(a) {
                    a = $(a),
                    m=a.parent().children("label.ui_radio"),
                    a.prop(d) ? ( a.attr(d, d),r(m,a.index(),true)): (a.removeAttr(d),r(m,a.index(),false)),
                    a.parent().addClass("z").toggleClass("i_i");
                };
            }else{
                var a = function(a) {
                    a = $(a),
                    a.prop(d) ? a.attr(d, d): a.removeAttr(d),
                    a.parent().addClass("z").toggleClass("i_i");
                };
            }


            if (1 == $(this).length && "radio" == $(this).attr("type")) {
                var b = $(this).attr("name");
                $("input[type=radio][name=" + b + "]").each(function() {
                    a(this)
                });
            } else
                $(this).each(function() {
                    $(this).addClass("radio");
                    a(this)
                });
            return $(this)
        }
    }
    ,
    c.exports = {
        match: function(a) {
            a.propMatch()
        },
        init: function() {
            if (!window.addEventListener && !window.initedRadio) {
                var a = "input[type=radio]";
                $(document.body).delegate(a, "click", function() {
                    $(this).propMatch()
                }),
                $(a).propMatch(),
                window.initedRadio = !0
            }
        }
    }
});
