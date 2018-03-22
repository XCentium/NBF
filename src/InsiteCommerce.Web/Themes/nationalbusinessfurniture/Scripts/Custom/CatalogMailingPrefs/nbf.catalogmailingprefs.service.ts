module nbf.CatalogMailingPrefs {
    "use strict";

    export interface INbfCatalogMailingPrefsService {
        sendEmail(params: any): ng.IPromise<string>;
    }

    export class NbfCatalogMailingPrefsService implements INbfCatalogMailingPrefsService {
        serviceUri = "api/nbf/catalogmailingprefs";        

        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any ) {
        }

        sendEmail(params: any): ng.IPromise<string> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri, method: "POST", data: params}),
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
        .service("nbfCatalogMailingPrefsService", NbfCatalogMailingPrefsService);
}