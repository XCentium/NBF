module nbf.WebCode {
    "use strict";

    export interface INbfWebCodeService {
        getWebCode(): ng.IPromise<string>;
    }

    export class NbfWebCodeService implements INbfWebCodeService {
        serviceUri = "/api/nbf/webcode";

        static $inject = ["$http", "httpWrapperService", "queryString"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService) {
        }

        getWebCode(): ng.IPromise<string> {
            const siteId = this.getSiteId();

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri, method: "GET", params: this.getWebCodeParams(siteId) }),
                this.getWebCodeCompleted,
                this.getWebCodeFailed
            );
        }

        protected getSiteId(): string {
            var siteId = "default_web";

            const siteIdQueryString = this.queryString.get("SiteID");
            const ganTrackingId = this.queryString.get("GanTrackingID");
            const affiliateSiteId = this.queryString.get("affiliateSiteID");
            const affId = this.queryString.get("affid");
            const origin = this.queryString.get("Origin");
            const ref = this.queryString.get("Ref");

            if (siteIdQueryString) {
                siteId = siteIdQueryString;
            } else if (ganTrackingId) {
                siteId = `gan_${ganTrackingId}`;
            } else if (affiliateSiteId) {
                siteId = affiliateSiteId;
            } else if (affId) {
                siteId = affId;
            } else if (origin) {
                siteId = origin;
            } else  if (ref) {
                siteId = ref;
            }

            return siteId;
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