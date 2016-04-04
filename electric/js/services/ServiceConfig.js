System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ServiceConfig;
    return {
        setters:[],
        execute: function() {
            ServiceConfig = (function () {
                function ServiceConfig() {
                }
                /**
                 * A static location to the server API endpoint
                 * @type {String}
                 */
                ServiceConfig.SERVER_URL = "http://159.203.11.151:8080";
                /**
                 * The API key; this should be kept a secret usually, but we're fine here
                 * for now.
                 * @type {String}
                 */
                ServiceConfig.API_KEY = "AIzaSyDMLDGm1PV9AwhvbosGsbbbdFuAARfrFdw";
                return ServiceConfig;
            }());
            exports_1("ServiceConfig", ServiceConfig);
        }
    }
});
//# sourceMappingURL=ServiceConfig.js.map
