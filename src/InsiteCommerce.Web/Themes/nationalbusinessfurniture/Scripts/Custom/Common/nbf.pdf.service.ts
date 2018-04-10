module nbf.pdf {
    "use strict";

    export interface INbfPdfService {
        getPdf(data: any): ng.IHttpPromise<string>;
    }

    export class NbfPdfService implements INbfPdfService {
        serviceUri = "/api/nbf/pdf";
        
        static $inject = ["$rootScope", "$http", "$q", "coreService"];

        constructor(protected $rootScope: ng.IRootScopeService,
            protected $http: ng.IHttpService,
            protected $q: ng.IQService,
            protected coreService: insite.core.ICoreService) {
        }

        getPdf(data: any): ng.IHttpPromise<string> {

            var uri = this.serviceUri;
            //var query = "?" + this.coreService.parseParameters(parameters);
            uri += "/GetPdf";
            var config = {
                headers: { 'Content-Type': "application/json" }
            };

            return this.$http.post(uri, data, { responseType: 'arraybuffer' });
        }

        protected getPdfCompleted(data: string): void {

        }

        protected getPdfFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }
    }

    function factory($rootScope: ng.IRootScopeService, $http: ng.IHttpService, $q: ng.IQService, coreService: insite.core.ICoreService): NbfPdfService {
        return new NbfPdfService($rootScope, $http, $q, coreService);
    }
    factory.$inject = ["$rootScope", "$http", "$q", "coreService"];

    angular
        .module("insite")
        .factory("nbfPdfService", factory);
}