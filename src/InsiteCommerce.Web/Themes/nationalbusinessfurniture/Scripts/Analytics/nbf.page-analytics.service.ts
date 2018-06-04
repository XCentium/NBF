module nbf.analytics {
    export interface IPageAnalyticsService {
        getPageAnalytics(): ng.IPromise<PageAnalyticsResult[]>
    }

    export class PageAnalyticsService implements IPageAnalyticsService {

        static $inject = ["$http", "$localStorage", "$q"];

        private _serviceUrl = "/api/nbf/analyticspages";
        private _storagekey = "nbf-analytics-pageanalyticsresults";

        constructor(protected $http: ng.IHttpService, protected $localStorage: insite.common.IWindowStorage, protected $q: ng.IQService) { }

        public getPageAnalytics(): ng.IPromise<PageAnalyticsResult[]> {
            var deferred = this.$q.defer<PageAnalyticsResult[]>();
            var cachedValue = this.$localStorage.getObject(this._storagekey);
            if (cachedValue && cachedValue instanceof PageAnalyticsCacheModel && (<PageAnalyticsCacheModel>cachedValue).ttl > Date.now()) {
                deferred.resolve(cachedValue.results);
            }
            this.$http.get<PageAnalyticsResult[]>(this._serviceUrl).then(results => {
                //Cache results for an hour
                this.$localStorage.setObject(this._storagekey, <PageAnalyticsCacheModel>{
                    results: results.data,
                    ttl: Date.now() + (1000 * 60 * 60)
                });
                deferred.resolve(results.data);
            }).catch(deferred.reject);
            return deferred.promise;
        }
    }

    angular
        .module("insite")
        .service("pageAnalyticsService", PageAnalyticsService);

    export class PageAnalyticsCacheModel {
        results: PageAnalyticsResult[];
        ttl: number;
    }

    export class PageAnalyticsResult {
        url: string;
        pageName: string;
        section: string;
        subSection: string;
        pageType: string;
    }
}