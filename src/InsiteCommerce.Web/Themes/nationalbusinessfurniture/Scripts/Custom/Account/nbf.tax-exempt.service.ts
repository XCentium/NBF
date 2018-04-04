module nbf.account {
    "use strict";

    export interface INbfTaxExemptService {
        //addPayment(payment: any): ng.IPromise<string>;
    }

    export class NbfTaxExemptService implements INbfTaxExemptService {
        serviceUri = "/api/nbf/taxexempt";


        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any ) {
        }
    }

    angular
        .module("insite")
        .service("nbfTaxExemptService", NbfTaxExemptService);
}