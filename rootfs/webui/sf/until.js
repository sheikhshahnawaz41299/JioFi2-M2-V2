<!-- 
document.oncontextmenu=function(e){return false;} 
// -->
document.onmousedown=function(e){
var e=e||window.event;
if(e.button&2)
{
document.oncontextmenu=function(e){return false;}
return false;
}	
}
//window.onerror = function() { return true;}
var xmlHttp;
var xmlpost;
function $(id){return document.getElementById(id);}
//function x_v(tag){return xmlHttp.responseXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue;}
function x_t(tag){return xmlHttp.responseXML.getElementsByTagName(tag)[0];}
function x_v(tag){var value = x_t(tag).childNodes[0].nodeValue; if(value=='-')return "";else return value;}
function x_tp(tag){return xmlpost.responseXML.getElementsByTagName(tag)[0];}
function x_vp(tag){return x_tp(tag).childNodes[0].nodeValue;}


function createXMLHttpRequest()
{
xmlHttp=null;
if(window.ActiveXObject)
{
xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
}
else if (window.XMLHttpRequest)
{
xmlHttp = new XMLHttpRequest();
}
}

function startRequest(xmlurl){
createXMLHttpRequest();
xmlHttp.onreadystatechange = function handleStateChange(){
if(xmlHttp.readyState == 4)
{
if(xmlHttp.status == 200)
{
 GetHandler(xmlurl);
}
}
};
xmlHttp.open("GET", xmlurl, true);
xmlHttp.setRequestHeader("If-Modified-Since","0");
xmlHttp.send(null);
}

function esc(str){
str=str.replace(/%/g,'%25');
str=str.replace(/&/g,'%26');
str=str.replace(/=/g,'%3D');
str=str.replace(/\+/g,'%2B');
str=str.replace(/ /g,'+');
str=str.replace(/\\/g,'%5C');
return str;
}

function ajax_post(url,form_data){
if (window.XMLHttpRequest){
xmlpost=new XMLHttpRequest();
}
else{
xmlpost=new ActiveXObject("Microsoft.XMLHTTP");
}
xmlpost.onreadystatechange=function()
{
if (xmlpost.readyState==4 && xmlpost.status==200){
PostHandler(url);
}
}
xmlpost.open("POST",url,true);
xmlpost.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlpost.send(form_data);
}


function getSelectOption(id){
var objId=$(id);
return objId.options[objId.selectedIndex].value;
}
function setSelectOption(objId, targetValue){
var obj = $(objId);
if(obj){
var options = obj.options;
if(options){
var len = options.length;
for(var i=0;i<len;i++){
if(options[i].value == targetValue){
//options[i].defaultSelected = true;
options[i].selected = true;
return true;
}
}
} 
} 
}


function getRadioValue (name) {
var selects = document.getElementsByName(name);
for (var i=0; i<selects.length; i++){
if (selects[i].checked == true) {
return selects[i].value;
break;
}
}
}

function setRadioInit (name,value)
{
var selects = document.getElementsByName(name);
for (var i=0; i<selects.length; i++){
if (selects[i].value==value) {
selects[i].checked= true;
break;
}
}
}

function radio_text_click(radio_name,val){
document.getElementsByName(radio_name)[val].checked=true;
}

function setInputText (name,text) {
if(text=='-') text='';
$(name).value=text;
}



function isIP(strIP)
{
var patrn =/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
if(isNull(strIP)) return false;
if(!patrn.exec(strIP))
{
return false;
}

laststr= strIP.split(".");
if(parseInt(laststr[0])>255||parseInt(laststr[1])>255||parseInt(laststr[2])>255||parseInt(laststr[3])>255)
{
return false;
}
return true;
}

function isNull(str){
if(str == "")
return true;
else return false;
}
function mac_check(macaddr){
if(macaddr.length!=12 && macaddr.length!=17) return false;
var reg = /^[A-Fa-f0-9]{12}$/
var reg1 = /^[A-Fa-f0-9]{1,2}\-[A-Fa-f0-9]{1,2}\-[A-Fa-f0-9]{1,2}\-[A-Fa-f0-9]{1,2}\-[A-Fa-f0-9]{1,2}\-[A-Fa-f0-9]{1,2}$/;
var reg2 = /^[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}$/;
if (reg.test(macaddr)) {
return true;
}
else if (reg1.test(macaddr)) {
return true;
} else if (reg2.test(macaddr)) {
return true;
} else {
return false;
}
}


function ppp_getDigit(str, num)
{ 
	i=1; 
	// replace the char '/' with character '.'  
	str = str.replace(/[/]/,".");	  
	if ( num != 1 ) 
	{  	
		while (i!=num && str.length!=0) 
		{		
			if ( str.charAt(0) == '.') 
			{			
				i++;		
			}
			str = str.substring(1);  	
		}
		if ( i!=num )  		
			return -1;  
	}  
	for (i=0; i<str.length; i++) 
	{  	
		if ( str.charAt(i) == '.') 
		{
			str = str.substring(0, i);		
			break;
		}  
	}  
	if ( str.length == 0)  	
		return -1;  
	d = parseInt(str, 10); 
	return d;
}

function ppp_checkDigitRange(str, num, min, max)
{	  
	d = ppp_getDigit(str,num);  
	if ( d > max || d < min )      	
		return false;  
	return true;
}

function ppp_validateKey(str)
{   
	for (var i=0; i<str.length; i++) 
	{    
		if ((str.charAt(i) >= '0' && str.charAt(i) <= '9') 
			||(str.charAt(i) == '.' ) || (str.charAt(i) == '/'))			
			continue;	
		return 0;  
	}  
	return 1;
}
function validateKey(str)
{
   for (var i=0; i<str.length; i++) {
    if ( (str.charAt(i) >= '0' && str.charAt(i) <= '9') ||
    		(str.charAt(i) == '.' ) )
			continue;
	return 0;
  }
  return 1;
}

function getDigit(str, num)
{
  var i=1;
  if ( num != 1 ) {
  	while (i!=num && str.length!=0) {
		if ( str.charAt(0) == '.' ) {
			i++;
		}
		str = str.substring(1);
  	}
  	if ( i!=num )
  		return -1;
  }
  for (i=0; i<str.length; i++) {
  	if ( str.charAt(i) == '.' ) {
		str = str.substring(0, i);
		break;
	}
  }
  if ( str.length == 0)
  	return -1;
  var d = parseInt(str, 10);
  return d;
}

function checkDigitRange(str, num, min, max)
{
  var d = getDigit(str,num);
  if ( d > max || d < min )
      	return false;
  return true;
}

function checkMask(str, num)
{
  var d = getDigit(str,num);  
  if(num==1)
  {
  	if( !(d==128 || d==192 || d==224 || d==240 || d==248 || d==252 || d==254 || d==255 ))
  		return false;
  }
  else
  {
  	if( !(d==0 || d==128 || d==192 || d==224 || d==240 || d==248 || d==252 || d==254 || d==255 ))
  		return false;
  }
  return true;
}

function checkWholeMask(str)
{
	if(str.length==0)
		return false;
	var d1 = getDigit(str,1);
	var d2 = getDigit(str,2);
	var d3 = getDigit(str,3);
	var d4 = getDigit(str,4);
	if(d1==-1||d2==-1||d3==-1||d4==-1||d1==0 || d1 !=255)
		return false;
	if(d1!=255&&d2!=0)
		return false;
	if(d2!=255&&d3!=0)
		return false;
	if(d3!=255&&d4!=0)
		return false;
	return true;
}


function checkSubnet(ip, mask, client)
{
  ip_d = getDigit(ip, 1);
  mask_d = getDigit(mask, 1);
  client_d = getDigit(client, 1);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  ip_d = getDigit(ip, 2);
  mask_d = getDigit(mask, 2);
  client_d = getDigit(client, 2);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  ip_d = getDigit(ip, 3);
  mask_d = getDigit(mask, 3);
  client_d = getDigit(client, 3);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  ip_d = getDigit(ip, 4);
  mask_d = getDigit(mask, 4);
  client_d = getDigit(client, 4);
  if ( (ip_d & mask_d) != (client_d & mask_d ) )
	return false;

  return true;
}
function checkIPMask(field)
{

  if (field.value=="") {
      	alert("Subnet mask cannot be empty! It should be filled with 4 digit numbers as xxx.xxx.xxx.xxx.");
	field.value = field.defaultValue;
	field.focus();
	return false;
  }
  if(field.value=="0.0.0.0"){
  		alert("Subnet mask cannot be 0.0.0.0!");
	field.value = field.defaultValue;
	field.focus();
	return false;
  }
  if ( validateKey( field.value ) == 0 ) {
      	alert("Invalid subnet mask value. It should be the decimal number (0-9).");
      	field.value = field.defaultValue;
	field.focus();
	return false;
  }
  if ( !checkMask(field.value,1) ) {
      	alert('Invalid subnet mask in 1st digit.\nIt should be the number of 128, 192, 224, 240, 248, 252 or 254');
	field.value = field.defaultValue;
	field.focus();
	return false;
  }

  if ( !checkMask(field.value,2) ) {
      	alert('Invalid subnet mask in 2nd digit.\nIt should be the number of 0, 128, 192, 224, 240, 248, 252 or 254');
	field.value = field.defaultValue;
	field.focus();
	return false;
  }
  if ( !checkMask(field.value,3) ) {
      	alert('Invalid subnet mask in 3rd digit.\nIt should be the number of 0, 128, 192, 224, 240, 248, 252 or 254');
	field.value = field.defaultValue;
	field.focus();
	return false;
  }
  if ( !checkMask(field.value,4) ) {
      	alert('Invalid subnet mask in 4th digit.\nIt should be the number of 0, 128, 192, 224, 240, 248, 252 or 254');
	field.value = field.defaultValue;
	field.focus();
	return false;
  }
   if(!checkWholeMask(field.value)){
  		alert("Invalid subnet mask.");
	field.value = field.defaultValue;
	field.focus;
	return false;
  }

}  
function checkIpAddr(field, msg)
{
  if (field.value=="") {
	alert("IP address cannot be empty! It should be filled with 4 digit numbers as xxx.xxx.xxx.xxx.");
	field.value = field.defaultValue;
	field.focus();
	return false;
  }
   if ( validateKey(field.value) == 0) {
      alert(msg + ' value. It should be the decimal number (0-9).');
      field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,1,1,223) ) {
      alert(msg+' range in 1st digit. It should be 1-223.');
      field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,2,0,255) ) {
      alert(msg + ' range in 2nd digit. It should be 0-255.');
      field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,3,0,255) ) {
      alert(msg + ' range in 3rd digit. It should be 0-255.');
      field.value = field.defaultValue;
      field.focus();
      return false;
   }
   if ( !checkDigitRange(field.value,4,1,254) ) {
      alert(msg + ' range in 4th digit. It should be 1-254.');
      field.value = field.defaultValue;
      field.focus();
      return false;
   }
   return true;
}

function skip () { this.blur(); }
function disableTextField (field) {
  if (document.all || document.getElementById)
    field.disabled = true;
  else {
    field.oldOnFocus = field.onfocus;
    field.onfocus = skip;
  }
}

function enableTextField (field) {
  if (document.all || document.getElementById)
    field.disabled = false;
  else {
    field.onfocus = field.oldOnFocus;
  }
}

function disableButton (button) {
  //if (verifyBrowser() == "ns")
  //  return;
  if (document.all || document.getElementById)
    button.disabled = true;
  else if (button) {
    button.oldOnClick = button.onclick;
    button.onclick = null;
    button.oldValue = button.value;
    button.value = 'DISABLED';
  }
}

function enableButton (button) {
  //if (verifyBrowser() == "ns")
  //  return;
  if (document.all || document.getElementById)
    button.disabled = false;
  else if (button) {
    button.onclick = button.oldOnClick;
    button.value = button.oldValue;
  }
}

function Byte2Format(size){
if(size<1024) size += 'B ';
else if(size<1048576) size = (size/1024).toFixed(1)+'KB ';
else if(size<1073741824) size = (size/1048576).toFixed(1)+'MB ';
else size = (size/1073741824).toFixed(1)+'GB ';
return size;
}