define("./Loading",["jquery-1.8.2.min"],function(a,b,c){a("jquery-1.8.2.min");var d="ui_loading",e="ui_loading_icon",f="ui_button",g="ui_button_loading",h="_";$.fn.loading=function(a){return $(this).each(function(){var b=$(this);0==b.hasClass(f)?b.data("loading",new i(b,a)):b.addClass(g)})},$.fn.unloading=function(a){return"number"!=typeof a&&(a=200),$(this).each(function(b,c){var e=$(this);if(e.hasClass(f))return void e.removeClass(g);if("function"==typeof history.pushState)if(a>0){var i=e.height();e.css("min-height"),e.css({height:"auto",webkitTransition:"none",transition:"none",overflow:"hidden"});var j=e.height();e.height(i),e.removeClass(d+h+"animation"),c.offsetWidth=c.offsetWidth,e.addClass(d+h+"animation"),e.css({webkitTransition:"height "+a+"ms",transition:"height "+a+"ms"}),e.height(j)}else e.css({webkitTransition:"none",transition:"none"}),e.height("auto").removeClass(d);else e.height("auto")})};var i=function(a,b){var c={primary:!1,small:!1,create:!1},f=$.extend({},c,b||{}),g=a,i=null,j=null;return this._create=function(){var a=this.el.container;i=a.find("."+d),j=a.find("."+e),1==f.create&&0==i.size()?a.append(i=$("<div></div>").addClass(d)):0==f.create&&(i=a),0==j.size()&&(j=(f.small?$("<s></s>"):$("<i></i>")).addClass(e),i.empty().addClass(d).append(j),f.primary&&i.addClass(d+h+"primary")),this.el.loading=i,this.el.icon=j},this.el={container:g,loading:i,icon:j},this.show(),this};return i.prototype.show=function(){var a=this.el;return a.loading&&a.icon||this._create(),a.loading.show(),this.display=!0,this},i.prototype.hide=function(){var a=this.el,b=a.container,c=a.loading;return c&&(b.get(0)!=c.get(0)?c.hide():b.find("."+e).length&&(c.empty(),this.el.icon=null)),this.display=!1,this},i.prototype.remove=function(){var a=this.el,b=a.container,c=a.loading,e=a.icon;return c&&e&&(b.get(0)==c.get(0)?(c.removeClass(d),e.remove()):c.remove(),this.el.loading=null,this.el.icon=null),this.display=!1,this},i.prototype.end=function(a){var b=this.el,c=b.container;return c&&(c.unloading(a),0==c.find("."+e).length&&(this.el.icon=null)),this.display=!1,this},i});