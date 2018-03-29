module nbf.PriceCode {
    import ContractOption = insite.account.ContractOption;
    "use strict";

    export interface INbfPriceCodeService {
        getPriceCode(billToId: string): ng.IPromise<ContractOption>;
        setPriceCode(priceCode: string, displayName: string, billToId: string): ng.IPromise<string>;
    }

    export class NbfPriceCodeService implements INbfPriceCodeService {
        serviceUri = "/api/nbf/pricecode";
        siteId: string;
        userId: string;

        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any ) {
        }

        getPriceCode(billToId: string): ng.IPromise<ContractOption> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri, method: "GET", params: this.getPriceCodeParams(billToId) }),
                this.getPriceCodeCompleted,
                this.getPriceCodeFailed
            );
        }
       
        protected getPriceCodeCompleted(priceCode: string): void {

        }

        protected getPriceCodeFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        protected getPriceCodeParams(billToId: string, priceCode?: string, displayName?: string): any {
            const params: any = {};
            params.billToId = billToId;
            if (priceCode) {
                params.priceCode = priceCode;
            }
            if (displayName) {
                params.displayName = displayName;
            }
            return params;
        }

        setPriceCode(priceCode: string, displayName: string, billToId: string): ng.IPromise<string> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.post(this.serviceUri + "/update", this.getPriceCodeParams(billToId, priceCode, displayName)),
                this.setPriceCodeCompleted,
                this.setPriceCodeFailed
            );
        }

        protected setPriceCodeCompleted(priceCode: string): void {

        }

        protected setPriceCodeFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }
    }

    angular
        .module("insite")
        .service("nbfPriceCodeService", NbfPriceCodeService);
}