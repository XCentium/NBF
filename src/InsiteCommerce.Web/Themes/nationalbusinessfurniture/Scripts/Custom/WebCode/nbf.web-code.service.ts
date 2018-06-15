module nbf.WebCode {
    "use strict";

    export interface INbfWebCodeService {

        getWebCode(userId: string): ng.IPromise<string>;
        //getCampaignID(): string;
        //getStoredTransID(): string;
    }

    export class NbfWebCodeService implements INbfWebCodeService {
        serviceUri = "/api/nbf/webcode";
        webcodeserviceurl = "/api/nbf/webcode/webcodeuniqueid";
        siteId: string;
        referrer: string;
        userId: string;
        currentWebCode: string;
        affId: string;

        static $inject = ["$http", "queryString", "ipCookie", "$q"];

        constructor(
            protected $http: ng.IHttpService,
            protected queryString: insite.common.IQueryStringService,
            protected ipCookie: any,
            protected $q: ng.IQService) {
        }

        getWebCode(userId: string): ng.IPromise<string> {
            var self = this;
            var promise = new this.$q((resolve, reject) => {
                var userIDPromise = self.getUserID();
                var affCode = self.StoredAffiliateCode;
                var siteId = self.getCampaignID();
                if (!siteId) {
                    siteId = self.getRefferer();
                }
                if (siteId) {
                    this.StoredCampaignID = siteId
                } else {
                    siteId = self.StoredCampaignID;
                }
                if (!siteId) {
                    siteId = self.DefaultCampaign;
                }

                userIDPromise.then(userId => {
                    self.$http.get(self.serviceUri, {
                        params: self.getWebCodeParams(siteId, userId)
                    }).then(response => resolve(response.data))
                        .catch(reject);
                });
            }); 
            promise.then(webcode => self.getWebCodeCompleted(webcode)).catch(error => self.getWebCodeFailed(error));
            return promise;
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

        protected getWebCodeCompleted(webCode: string) {
            var webCodeSplit = webCode.split("-");
            this.StoredTransID = webCodeSplit[0];
            this.StoredAffiliateCode = webCodeSplit[1];
        }

        protected getWebCodeFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        protected getWebCodeParams(siteId: string, userId: any): any {
            const params: any = {};
            params.siteId = siteId;
            params.userId = userId;
            return params;
        }

        protected getUserID(): ng.IPromise<string>{
            return new this.$q((resolve, reject) => {
                var userId = this.ipCookie("UserOmnitureTransID");
                if (userId) {
                    resolve(userId);
                } else {
                    this.$http.get(this.webcodeserviceurl)
                        .then(response => {
                            this.ipCookie("UserOmnitureTransID", response.data, { path: "/" });
                            resolve(response.data);
                        })
                        .catch(reject);
                }
            });           
        }

        getCampaignID(): string {
          

            var siteId = null;

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

        getRefferer(): string {
            var referrer = document.referrer;
            if (referrer) {
                var searchEngineList = this.getSearchEngineDomains();
                for (var se in searchEngineList) {
                    if (referrer.indexOf(se) > -1) {
                        return searchEngineList[se];
                    }
                }
            }
            return null;
        }

        private get StoredTransID(): string {
            return this.ipCookie("UserOmnitureTransID");
        }

        private set StoredTransID(transId: string) {
            var expire = new Date();
            expire.setTime(expire.getTime() + 90 * 24 * 60 * 60 * 1000);
            this.ipCookie("UserOmnitureTransID", transId, { path: "/", expires: expire });
        }

        private get StoredAffiliateCode(): string {
            return this.ipCookie("UserAffiliateCodeID");
        }

        private set StoredAffiliateCode(affCode: string) {
            var expire = new Date();
            expire.setTime(expire.getTime() + 90 * 24 * 60 * 60 * 1000);
            this.ipCookie("UserAffiliateCodeID", affCode, { path: "/", expires: expire });
        }

        private get StoredCampaignID(): string {
            return this.ipCookie("CampaignID");
        }

        private set StoredCampaignID(campaignId: string) {
            if (!campaignId || campaignId == "default_web") {
                return;
            }
            var expire = new Date();
            expire.setTime(expire.getTime() + 90 * 24 * 60 * 60 * 1000);
            this.ipCookie("CampaignID", campaignId, { path: "/", expires: expire });
        }

        private get DefaultCampaign(): string {
            return "default_web";
        }
    }

    angular
        .module("insite")
        .service("nbfWebCodeService", NbfWebCodeService);
}
