module insite.account {
    "use strict";

    export interface INbfTaxExemptService {
        addTaxExempt(id: string): ng.IPromise<boolean>;
        removeTaxExempt(id: string): ng.IPromise<boolean>;
    }

    export class NbfTaxExemptService implements INbfTaxExemptService {
        serviceUri = "/api/nbf/taxExempt";

        static $inject = ["$http", "httpWrapperService", "customerService", "$location", "$localStorage", "sessionService", "cartService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService,
            protected customerService: customers.ICustomerService,
            protected $location: ng.ILocaleService,
            protected $localStorage: common.IWindowStorage,
            protected sessionService: account.ISessionService,
            protected cartService: cart.ICartService) {
        }

        addTaxExempt(id: string): ng.IPromise<boolean> {
            const uri = this.serviceUri + "/addTaxExempt?billToId=" + id;
            
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET" }),
                this.updateBillToCompleted,
                this.updateBillToFailed);
        }

        removeTaxExempt(id: string): ng.IPromise<boolean> {
            const uri = this.serviceUri + "/removeTaxExempt?billToId=" + id;

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET" }),
                this.updateBillToCompleted,
                this.updateBillToFailed);
        }

        protected updateBillToCompleted(response: ng.IHttpPromiseCallbackArg<boolean>) {

        }

        protected updateBillToFailed(error: any) {

        }
    }

    angular
        .module("insite")
        .service("nbfTaxExemptService", NbfTaxExemptService);
}