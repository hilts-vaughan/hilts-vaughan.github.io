System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ChargerType;
    return {
        setters:[],
        execute: function() {
            /**
             * Represents a basic charging type available, which is eventually assigned back
             * to something else on the server.
             */
            (function (ChargerType) {
                ChargerType[ChargerType["Default"] = 0] = "Default";
                ChargerType[ChargerType["Supercharger"] = 1] = "Supercharger";
                ChargerType[ChargerType["CHAMEDO"] = 2] = "CHAMEDO";
            })(ChargerType || (ChargerType = {}));
            exports_1("ChargerType", ChargerType);
        }
    }
});
//# sourceMappingURL=ChargerType.js.map