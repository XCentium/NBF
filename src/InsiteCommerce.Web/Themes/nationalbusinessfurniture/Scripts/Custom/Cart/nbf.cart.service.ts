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

        removeLine(cartLine: CartLineModel): ng.IPromise<CartLineModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.delete(cartLine.uri),
                (response) => this.nbfRemoveLineCompleted(response, cartLine),
                this.removeLineFailed
            );
        }

        protected nbfRemoveLineCompleted(response: ng.IHttpPromiseCallbackArg<CartLineModel>, cartLine: CartLineModel): void {
            super.removeLineCompleted(response);
            this.$rootScope.$broadcast("AnalyticsEvent", "ProductRemovedFromCart", null, null, cartLine);
        }

        //protected addLineCompleted(response: ng.IHttpPromiseCallbackArg<CartLineModel>, showAddToCartPopup?: boolean): void {
        //    super.addLineCompleted(response, showAddToCartPopup);
        //    this.$rootScope.$broadcast("AnalyticsEvent", "ProductAddedToCart", null, null, response.data);
        //}

        addLine(cartLine: CartLineModel, toCurrentCart = false, showAddToCartPopup?: boolean): ng.IPromise<CartLineModel> {
            var existingCart = false;
            if (this.currentCart && this.currentCart.cartLines && this.currentCart.cartLines.length > 0) {
                existingCart = true;
            }
            var promise = super.addLine(cartLine, toCurrentCart, showAddToCartPopup);
            promise.then((cartLine) => {
                this.$rootScope.$broadcast("AnalyticsEvent", "ProductAddedToCart", null, null, cartLine);
                if (!existingCart) {
                    this.$rootScope.$broadcast("AnalyticsEvent", "CartOpened");
                }
            });
            return promise;
        }
    }

    angular
        .module("insite")
        .service("cartService", NbfCartService);
}