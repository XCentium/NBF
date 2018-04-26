module insite.cart {
    "use strict";

    export class NbfCartLinesController extends CartLinesController {
        static $inject = ["$scope", "cartService", "productService", "productSubscriptionPopupService", "addToWishlistPopupService", "spinnerService", "$q"];

        constructor(
            protected $scope: ICartScope,
            protected cartService: ICartService,            
            protected productSubscriptionPopupService: catalog.ProductSubscriptionPopupService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected spinnerService: core.ISpinnerService,
            protected $q: ng.IQService) {

            super($scope, cartService, productSubscriptionPopupService, addToWishlistPopupService, spinnerService);
        }        
    }

    angular
        .module("insite")
        .controller("CartLinesController", NbfCartLinesController);
}