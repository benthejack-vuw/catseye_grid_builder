var DrawingUtils = {};

DrawingUtils.grey = function(g){
	return "rgba("+g+", "+g+", "+g+", 1)";
};

DrawingUtils.rgb = function(r, g, b){
	return "rgba("+r+", "+g+", "+b+", 1)";
};

DrawingUtils.rgba = function(r, g, b, a){
	return "rgba("+r+", "+g+", "+b+", "+a/255.0+")";
};

