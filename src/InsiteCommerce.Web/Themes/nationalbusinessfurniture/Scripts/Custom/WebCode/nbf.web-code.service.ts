module nbf.WebCode {
    "use strict";

    export interface INbfWebCodeService {

        getWebCode(userId: string): ng.IPromise<string>;
        getCampaignID(): string;
        getStoredTransID(): string;
    }

    export class NbfWebCodeService implements INbfWebCodeService {
        serviceUri = "/api/nbf/webcode";
        webcodeserviceurl = "/api/nbf/webcode/webcodeuniqueid";
        siteId: string;
        referrer: string;
        userId: any;
        currentWebCode: string;
        affId: string;

        static $inject = ["$http", "httpWrapperService", "$sessionStorage", "queryString", "ipCookie", "$q"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected queryString: insite.common.IQueryStringService,
            protected ipCookie: any,
            protected $q: ng.IQService) {
        }

        getWebCode(userId: string): ng.IPromise<string> {
            
            if (this.getSessionWebCodeID()) {
                const deferred = this.$q.defer();
                var UserWebCode = this.$sessionStorage.get("UserWebCode")

                deferred.resolve(UserWebCode.replace(/(^")|("$)/g,''));
                const webCodePromise = (deferred.promise as ng.IPromise<string>);
                return webCodePromise;
            } else {
                
                this.userId = this.ipCookie("UserOmnitureTransID");

                var referrer = document.referrer;
                
                if (referrer) {
                    var searchEngineList = this.getSearchEngineDomains();

                    for (var se in searchEngineList) {
                        if (referrer.indexOf(se) > -1) {
                            this.siteId = searchEngineList[se];
                            break;
                        }
                    }
                } else {
                    this.siteId = this.getCampaignID();
                }

                var self = this;
                const deferred = this.$q.defer();

                if (this.userId) {
                    self.httpWrapperService.executeHttpRequest(
                        self,
                        self.$http({ url: self.serviceUri, method: "GET", params: self.getWebCodeParams(self.siteId, self.userId) }),
                        self.getWebCodeCompleted,
                        self.getWebCodeFailed
                    ).then(function (webCode) {
                        deferred.resolve(webCode);

                    });
                } else {
                    this.$http.get(this.webcodeserviceurl)
                        .then(function (answer) {
                            return self.httpWrapperService.executeHttpRequest(
                                self,
                                self.$http({ url: self.serviceUri, method: "GET", params: self.getWebCodeParams(self.siteId, answer.data) }),
                                self.getWebCodeCompleted,
                                self.getWebCodeFailed
                            ).then(function (webCode) {
                                deferred.resolve(webCode);
                            });
                        });
                }
                
                return (deferred.promise as ng.IPromise<string>);

            }
        }

        protected getSearchEngineDomains() {
            var searchEngines = "ochdevsite.:ochdev,google.:glo_nbf,msn.:mso_nbf,bing.:mso_nbf,yahoo.:yho_nbf,aol.:aol_nbf,facebook.:fb_NBF_Social,instagram.:ig_NBF_Social,pinterest.:pin_NBF_Social,linkedin.:lin_NBF_Social,youtube.:yt_NBF_Social,ask.,about.,baidu.,yandex.,search.,duckduckgo.,localhost:loco_nbf";
            var domainList = {};
            searchEngines.split(",").forEach(se => {
                var tokens = se.split(":", 2).filter(t => t && t.trim() != "");
                var trackingCode = tokens.length > 1 ? tokens[1] : "Organic";
                domainList[tokens[0]] = trackingCode;
            });
            return domainList;
        }

        protected getWebCodeCompleted(webCode: any): string {
            var expire = new Date();
            expire.setDate(expire.getDate() + 90);
            var webCodeSplit = webCode.data.split("-");
            this.ipCookie("UserAffiliateCodeID", webCodeSplit[1], { path: "/", expires: expire });
            this.ipCookie("UserOmnitureTransID", webCodeSplit[0], { path: "/",expires: expire });
            this.ipCookie("web_code_cookie", webCode.data, { path: "/", expires: expire });
            this.$sessionStorage.setObject("UserWebCode", webCode.data);
            return webCode.data;
        }

        protected getWebUserCompleted(webCode: any): void {
            this.userId = webCode.data;
        }

        protected getWebCodeFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        protected getWebCodeParams(siteId: string, userId: any): any {
            const params: any = {};
            params.siteId = siteId;
            params.userId = userId;
            return params;
        }

        getCampaignID(): string {
          

            var siteId = "default_web";

            const siteIdQueryString = this.queryString.get("SiteID");
            const ganTrackingId = this.queryString.get("GanTrackingID");
            const affiliateSiteId = this.queryString.get("affiliateSiteID");
            const affId = this.queryString.get("afid");
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
   
        getSessionWebCodeID(): string {
            if (this.$sessionStorage.get("UserWebCode")) {
                return this.$sessionStorage.get("UserWebCode");
            }
            return "";
        }

       getStoredTransID(): string {
            if (this.ipCookie("UserOmnitureTransID")) {
                return this.ipCookie("UserOmnitureTransID");
            }
            return "";
        }
    }

    angular
        .module("insite")
        .service("nbfWebCodeService", NbfWebCodeService);
}
