module insite.cart {
    export class NbfCartLinesController extends CartLinesController{

        static $inject = ["$scope", "cartService", "productSubscriptionPopupService", "addToWishlistPopupService", "spinnerService", "productPriceService"];

        constructor(
            protected $scope: ICartScope,
            protected cartService: ICartService,
            protected productSubscriptionPopupService: catalog.ProductSubscriptionPopupService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected spinnerService: core.ISpinnerService,
            protected productPriceService: catalog.IProductPriceService) {
            super($scope, cartService, productSubscriptionPopupService, addToWishlistPopupService, spinnerService);
        }

        getFOBPricing(cartLine: CartLineModel) {
            var freight = parseFloat(cartLine.properties['freight']);
            var unitPrice = cartLine.pricing.unitNetPrice + (isNaN(freight) ? 0 : freight);
            var totalPrice = unitPrice * cartLine.qtyOrdered;
            return "$" + totalPrice.toFixed(2).toString();
        }
    }

    angular
        .module('insite')
        .controller('CartLinesController', NbfCartLinesController);
}