System.register("DrawingUtils", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function grey(g) {
        return "rgba(" + g + ", " + g + ", " + g + ", 1)";
    }
    exports_1("grey", grey);
    function rgb(r, g, b) {
        return "rgba(" + r + ", " + g + ", " + b + ", 1)";
    }
    exports_1("rgb", rgb);
    function rgba(r, g, b, a) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a / 255.0 + ")";
    }
    exports_1("rgba", rgba);
    return {
        setters:[],
        execute: function() {
            ;
            ;
            ;
        }
    }
});
