module nbf.WebCode {
    "use strict";

    export interface INbfWebCodeService {
        getWebCode(): ng.IPromise<string>;
    }

    export class NbfWebCodeService implements INbfWebCodeService {
        serviceUri = "/api/nbf/webcode";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService) {
        }

        getWebCode(): ng.IPromise<string> {
            var siteId = this.getSiteId();

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri, method: "GET", params: this.getWebCodeParams(siteId) }),
                this.getWebCodeCompleted,
                this.getWebCodeFailed
            );
        }

        protected getSiteId(): string {
            return "";
        }

        protected getWebCodeIdCompleted(response: ng.IHttpPromiseCallbackArg<OrderModel>): void {

        }

        protected getWebCodeCompleted(response: ng.IHttpPromiseCallbackArg<OrderModel>): void {

        }

        protected getWebCodeFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        protected getWebCodeParams(siteId: string): any {
            const params: any = {};
            params.siteId = siteId;
            return params;
        }
    }

    angular
        .module("insite")
        .service("nbfWebCodeService", NbfWebCodeService);
}