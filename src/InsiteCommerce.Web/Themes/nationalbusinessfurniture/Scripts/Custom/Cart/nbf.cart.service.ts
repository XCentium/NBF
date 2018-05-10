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
        
        protected addLineCompleted(response: ng.IHttpPromiseCallbackArg<CartLineModel>, showAddToCartPopup?: boolean): void {
            const cartLine = response.data;
            this.addToCartPopupService.display({ isQtyAdjusted: cartLine.isQtyAdjusted, showAddToCartPopup: showAddToCartPopup });
            cartLine.availability = cartLine.availability;
            this.getCart().then((cart) => {
                this.$rootScope.$broadcast("AnalyticsEvent", "ProductAddedToCart");
            });
            this.$rootScope.$broadcast("cartChanged");
            
        }
        
        protected addLineCollectionCompleted(response: ng.IHttpPromiseCallbackArg<CartLineCollectionModel>, showAddToCartPopup?: boolean): void {
            const cartLineCollection = response.data;
            const isQtyAdjusted = cartLineCollection.cartLines.some((line) => {
                return line.isQtyAdjusted;
            });

            this.addToCartPopupService.display({ isAddAll: true, isQtyAdjusted: isQtyAdjusted, showAddToCartPopup: showAddToCartPopup });

            this.getCart().then((cart) => {
                this.$rootScope.$broadcast("AnalyticsEvent", "ProductAddedToCart");
            });
            this.$rootScope.$broadcast("cartChanged");
        }

        protected addLineCollectionFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            this.showCartError(error.data);
        }

        
    }

    angular
        .module("insite")
        .service("cartService", NbfCartService);
}