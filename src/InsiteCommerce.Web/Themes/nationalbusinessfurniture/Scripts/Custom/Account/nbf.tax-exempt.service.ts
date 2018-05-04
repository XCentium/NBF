module insite.account {
    "use strict";

    export interface INbfTaxExemptService {
        updateBillto(id: string): ng.IPromise<boolean>;
    }

    export class NbfTaxExemptService implements INbfTaxExemptService {
        serviceUri = "/api/nbf/taxExempt";

        static $inject = ["$http", "httpWrapperService", "customerService", "$location", "$localStorage", "sessionService", "cartService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected customerService: insite.customers.ICustomerService,
            protected $location: ng.ILocaleService,
            protected $localStorage: insite.common.IWindowStorage,
            protected sessionService: insite.account.ISessionService,
            protected cartService: insite.cart.ICartService) {
        }

        updateBillto(id: string): ng.IPromise<boolean> {
            var uri = this.serviceUri + "/updateBillTo?billToId=" + id;
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET" }),
                this.updateBillToCompleted,
                this.updateBillToFailed);
        }

        protected updateBillToCompleted(response: ng.IHttpPromiseCallbackArg<boolean>) {
            this.cartService.expand = "cartlines,shipping,tax,carriers,paymentoptions";
            this.cartService.getCart().then(() => {
                
            });
        }

        protected updateBillToFailed(error: any) {

        }
    }

    angular
        .module("insite")
        .service("nbfTaxExemptService", NbfTaxExemptService);
}