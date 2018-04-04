module nbf.email {
    "use strict";

    export interface INbfEmailService {
        sendCatalogPrefsEmail(params: any): ng.IPromise<string>;
    }

    export class NbfEmailService implements INbfEmailService {
        serviceUri = "api/nbf/email";        

        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any ) {
        }

        sendCatalogPrefsEmail(params: any): ng.IPromise<string> {
            const uri = this.serviceUri + "/catalogPrefs";

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "POST", data: params}),
                this.sendEmailCompleted,
                this.sendEmailFailed
            );
        }

        protected sendEmailCompleted(catalogMailingPrefs: string): void {
            
        }

        protected sendEmailFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }        
    }

    angular
        .module("insite")
        .service("nbfEmailService", NbfEmailService);
}