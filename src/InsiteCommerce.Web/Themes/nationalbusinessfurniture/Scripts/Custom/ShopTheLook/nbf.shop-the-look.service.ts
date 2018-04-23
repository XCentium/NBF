module nbf.ShopTheLook {
    "use strict";

    export interface INbfShopTheLookService {
        getLooks(): ng.IPromise<ShopTheLookCollection>;
        getLook(shopTheLookId: string): ng.IPromise<ShopTheLook>;
    }

    export class NbfShopTheLookService implements INbfShopTheLookService {
        serviceUri = "/api/nbf/shopthelook";
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

        getLooks(): ng.IPromise<ShopTheLookCollection> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri, method: "GET" }),
                this.getLookCollectionCompleted,
                this.getLookCollectionFailed
            );
        }
       
        protected getLookCollectionCompleted(shopTheLookCollection: ShopTheLookCollection): void {

        }

        protected getLookCollectionFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        getLook(shopTheLookId: string): ng.IPromise<ShopTheLook> {
            var uri = this.serviceUri + "/" + shopTheLookId;
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET" }),
                this.getLookCompleted,
                this.getLookFailed
            );
        }

        protected getLookCompleted(priceCode: string): void {

        }

        protected getLookFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }
    }

    export interface ShopTheLookCollection {
        
    }

    export interface ShopTheLook {

    }

    angular
        .module("insite")
        .service("nbfShopTheLookService", NbfShopTheLookService);
}