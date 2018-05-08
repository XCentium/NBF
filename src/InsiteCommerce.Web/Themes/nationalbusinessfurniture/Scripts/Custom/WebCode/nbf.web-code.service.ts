module nbf.WebCode {
    "use strict";

    export interface INbfWebCodeService {
        getWebCode(): ng.IPromise<string>;
    }

    export class NbfWebCodeService implements INbfWebCodeService {
        serviceUri = "/api/nbf/webcode";
        siteId: string;
        userId: string;

        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie", "$q"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any,
            protected $q: ng.IQService) {
        }

        getWebCode(): ng.IPromise<string> {
            this.userId = this.generateId();
            const currentWebCode = this.checkWebCode();
            if (currentWebCode) {
                const deferred = this.$q.defer();
                deferred.resolve(currentWebCode);
                const webCodePromise = (deferred.promise as ng.IPromise<string>);
                return webCodePromise;
            }

            this.siteId = this.getSiteId();

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri, method: "GET", params: this.getWebCodeParams(this.siteId) }),
                this.getWebCodeCompleted,
                this.getWebCodeFailed
            );
        }
       
        protected getWebCodeCompleted(webCode: any): void {
            var expire = new Date();
            expire.setDate(expire.getDate() + 90);
            var webCodeSplit = webCode.data.split("-");
            this.$sessionStorage.setObject("UserAffiliateCodeID", webCodeSplit[1]);
            this.$sessionStorage.setObject("UserOmnitureTransID", webCodeSplit[1]);
            this.ipCookie("referring_cookie", webCodeSplit[1], { path: "/", expires: expire });
            this.ipCookie("web_code_cookie", webCode.data, { path: "/", expires: expire });
        }

        protected getWebCodeFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        protected getWebCodeParams(siteId: string): any {
            const params: any = {};
            params.siteId = siteId;
            params.userId = this.userId;
            return params;
        }

        protected generateId(): string {
            let text = "";
            const possible = "ABCDEFGHIJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";

            for (let i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text.toUpperCase();
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
            } else if (ref) {
                siteId = ref;
            }

            return siteId;
        }

        protected checkWebCode(): string {
            if (this.ipCookie("referring_cookie") && this.ipCookie("web_code_cookie")) {
                this.$sessionStorage.setObject("UserAffiliateCodeID", this.ipCookie("referring_cookie"));
                var totalCodeSplit = this.ipCookie("web_code_cookie").split("-");
                if (totalCodeSplit.length >= 2) {
                    [this.siteId, this.userId] = totalCodeSplit;
                }
                this.$sessionStorage.setObject("UserOmnitureTransID", this.siteId);
                return this.ipCookie("web_code_cookie");
            }
            return null;
        }
    }

    angular
        .module("insite")
        .service("nbfWebCodeService", NbfWebCodeService);
}