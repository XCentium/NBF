module nbf.email {
    "use strict";

    export interface INbfEmailService {
        sendCatalogPrefsEmail(params: any): ng.IPromise<string>;
        sendTaxExemptEmail(params: any): ng.IPromise<string>;
    }

    export class NbfEmailService implements INbfEmailService {
        serviceUri = "api/nbf/email";        

        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie", "$q"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any,
            protected $q: ng.IQService) {
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

        sendTaxExemptEmail(params: any): ng.IPromise<string> {
            const uri = this.serviceUri + "/taxexempt";
            
            var xhr = new XMLHttpRequest();
            var result = "false";
            xhr.open("POST", "/ContactUs/SendTaxExemptEmail");
            xhr.send(params);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    result = "true";
                }
            }

            const defer = this.$q.defer<string>();
            defer.resolve(result);
            return defer.promise;
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