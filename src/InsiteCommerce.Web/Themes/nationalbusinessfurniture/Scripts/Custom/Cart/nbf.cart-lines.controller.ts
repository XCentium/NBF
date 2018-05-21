module nbf.cart {
    export class NbfCartLinesController extends insite.cart.CartLinesController {
        static $inject = ["$scope", "cartService", "productSubscriptionPopupService", "addToWishlistPopupService", "spinnerService", "$rootScope"];
        constructor(
            protected $scope: insite.cart.ICartScope,
            protected cartService: insite.cart.ICartService,
            protected productSubscriptionPopupService: insite.catalog.ProductSubscriptionPopupService,
            protected addToWishlistPopupService: insite.wishlist.AddToWishlistPopupService,
            protected spinnerService: insite.core.ISpinnerService,
            protected $rootScope: ng.IRootScopeService) {
            super($scope, cartService, productSubscriptionPopupService, addToWishlistPopupService, spinnerService);
        }

        //protected removeLineCompleted(cartLine: CartLineModel): void {
        //    this.$rootScope.$broadcast("AnalyticsEvent", "ProductRemovedFromCart", null, null, cartLine);
        //}
    }

    angular
        .module("insite")
        .controller("CartLinesController", NbfCartLinesController);
}