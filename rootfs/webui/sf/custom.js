$.fn.setCursorPosition = function(start,end){
if(this.length == 0) return this;
return $(this).setSelection(start, end);
}

$.fn.setSelection = function(selectionStart, selectionEnd) {
if(this.length == 0) return this;
input = this[0];

if (input.createTextRange) {
var range = input.createTextRange();
range.collapse(true);
range.moveEnd('character', selectionEnd);
range.moveStart('character', selectionStart);
range.select();
} else if (input.setSelectionRange) {
input.focus();
input.setSelectionRange(selectionStart, selectionEnd);
}
return this;
}
$.fn.focusEnd = function(){
this.setCursorPosition(this.val().length);
return this;
}
Date.prototype.Format = function(formatStr)
{
var str = formatStr;
var Week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var Mon = this.getMonth()+1;
str=str.replace(/yyyy|YYYY/,this.getFullYear());
str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));
str=str.replace(/MM/,Mon>9?Mon.toString():'0' + Mon);
str=str.replace(/M/g,this.getMonth());
str=str.replace(/w|W/g,Week[this.getDay()]);
str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
str=str.replace(/d|D/g,this.getDate());
str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
str=str.replace(/h|H/g,this.getHours());
str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
str=str.replace(/m/g,this.getMinutes());
str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
str=str.replace(/s|S/g,this.getSeconds());
return str;
}