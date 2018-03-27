module insite.layout {
    "use strict";

    export class NbfHeaderController extends HeaderController {
        cart: CartModel;
        session: any;
        isVisibleSearchInput = false;

        static $inject = ["$scope", "$timeout", "cartService", "sessionService", "$window", "coreService"];

        constructor(
            protected $scope: ng.IScope,
            protected $timeout: ng.ITimeoutService,
            protected cartService: cart.ICartService,
            protected sessionService: account.ISessionService,
            protected $window: ng.IWindowService,
            protected coreService: core.ICoreService) {
            super($scope, $timeout, cartService, sessionService, $window);
        }

        saveCart(saveSuccessUri: string, signInUri: string): void {
            if (!this.cart.isAuthenticated || this.cart.isGuestOrder) {
                this.coreService.redirectToPath(`${signInUri}?returnUrl=${this.coreService.getCurrentPath()}`);
                return;
            }
            this.cartService.saveCart(this.cart).then(
                (cart: CartModel) => this.saveCartCompleted(saveSuccessUri, cart),
                (error: any) => { this.saveCartFailed(error); });
        }

        protected saveCartCompleted(saveSuccessUri: string, cart: CartModel): void {
            this.cartService.getCart();
            if (cart.id !== "current") {
                this.coreService.redirectToPath(`${saveSuccessUri}?cartid=${cart.id}`);
            }
        }

        protected saveCartFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("HeaderController", NbfHeaderController);
}