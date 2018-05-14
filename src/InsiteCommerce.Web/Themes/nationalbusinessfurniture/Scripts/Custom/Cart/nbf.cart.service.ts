module insite.cart {
    "use strict";

    export class NbfCartService extends CartService {
        
        static $inject = ["$http", "$rootScope", "$q", "addressErrorPopupService", "addToCartPopupService", "apiErrorPopupService", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected $rootScope: ng.IRootScopeService,
            protected $q: ng.IQService,
            protected addressErrorPopupService: cart.IAddressErrorPopupService,
            protected addToCartPopupService: IAddToCartPopupService,
            protected apiErrorPopupService: core.IApiErrorPopupService,
            protected httpWrapperService: core.HttpWrapperService) {
            super($http, $rootScope, $q, addressErrorPopupService, addToCartPopupService, apiErrorPopupService, httpWrapperService);
        }

        protected addLineCollectionFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            this.showCartError(error.data);
        }
    }

    angular
        .module("insite")
        .service("cartService", NbfCartService);
}