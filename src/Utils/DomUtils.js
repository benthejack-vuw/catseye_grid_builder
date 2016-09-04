var DomUtils = {};

DomUtils.editDomElementAttr = function(slider, attr, value){
	document.getElementById(slider).setAttribute(attr, value);
};