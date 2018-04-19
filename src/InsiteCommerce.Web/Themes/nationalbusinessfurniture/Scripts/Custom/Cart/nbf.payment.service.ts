module nbf.cart {
    "use strict";

    export interface INbfPaymentService {
        addPayment(payment: any): ng.IPromise<string>;
    }

    export class NbfPaymentService implements INbfPaymentService {
        serviceUri = "/api/nbf/creditcardtransaction";


        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any ) {
        }

        addPayment(payment: any): ng.IPromise<string> {
            var uri = this.serviceUri;
            //var query = "?" + this.coreService.parseParameters(parameters);
            uri += "/AddCCTransaction";
            var config = {
                headers: { 'Content-Type': "application/json" }
            };
            
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.post(uri, payment, config),
                this.addPaymentCompleted,
                this.addPaymentFailed
            );
        }
       
        protected addPaymentCompleted(): void {

        }

        protected addPaymentFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }
    }

    angular
        .module("insite")
        .service("nbfPaymentService", NbfPaymentService);
}