System.register("DomUtils", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function editDomElementAttr(id, attr, value) {
        document.getElementById(id).setAttribute(attr, value);
    }
    exports_1("editDomElementAttr", editDomElementAttr);
    return {
        setters:[],
        execute: function() {
        }
    }
});
