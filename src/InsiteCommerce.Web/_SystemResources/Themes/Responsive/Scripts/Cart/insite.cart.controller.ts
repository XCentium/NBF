import CartSettingsModel = Insite.Cart.WebApi.V1.ApiModels.CartSettingsModel;

module insite.cart {
    "use strict";

    export class CartController {
        cart: CartModel;
        promotions: PromotionModel[];
        settings: CartSettingsModel;
        showInventoryAvailability = false;
        productsCannotBePurchased = false;
        requiresRealTimeInventory = false;
        failedToGetRealTimeInventory = false;

        static $inject = ["$scope", "cartService", "promotionService", "settingsService", "coreService", "$localStorage"];

        constructor(
            protected $scope: ICartScope,
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected settingsService: core.ISettingsService,
            protected coreService: core.ICoreService,
            protected $localStorage: common.IWindowStorage) {
            this.init();
        }

        init(): void {
            this.initEvents();
            this.cartService.cartLoadCalled = true; // prevents request race
        }

        protected initEvents(): void {
            this.$scope.$on("cartChanged", (event: ng.IAngularEvent) => this.onCartChanged(event));

            this.settingsService.getSettings().then(
                (settings: core.SettingsCollection) => { this.getSettingsCompleted(settings); },
                (error: any) => { this.getSettingsFailed(error); });
        }

        protected onCartChanged(event: ng.IAngularEvent): void {
            this.getCart();
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.cartSettings;
            this.showInventoryAvailability = settingsCollection.productSettings.showInventoryAvailability;
            this.requiresRealTimeInventory = settingsCollection.productSettings.realTimeInventory;
            this.getCart();
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getCart(): void {
            this.cartService.expand = "cartlines,costcodes";
            if (this.settings.showTaxAndShipping) {
                this.cartService.expand += ",shipping,tax";
            }
            const hasRestrictedProducts = this.$localStorage.get("hasRestrictedProducts");
            if (hasRestrictedProducts === true.toString()) {
                this.cartService.expand += ",restrictions";
            }
            this.cartService.getCart().then(
                (cart: CartModel) => { this.getCartCompleted(cart); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getCartCompleted(cart: CartModel): void {
            this.cartService.expand = "";
            if (!cart.cartLines.some(o => o.isRestricted)) {
                this.$localStorage.remove("hasRestrictedProducts");
                this.productsCannotBePurchased = false;
            } else {
                this.productsCannotBePurchased = true;
            }
            this.displayCart(cart);
            this.getRealTimeInventory();
        }

        protected getCartFailed(error: any): void {
            this.cartService.expand = "";
        }

        displayCart(cart: CartModel): void {
            this.cart = cart;
            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => { this.getCartPromotionsCompleted(promotionCollection); },
                (error: any) => { this.getCartPromotionsFailed(error); });
        }

        protected getCartPromotionsCompleted(promotionCollection: PromotionCollectionModel): void {
            this.promotions = promotionCollection.promotions;
        }

        protected getCartPromotionsFailed(error: any): void {
        }

        getRealTimeInventory(): void {
            if (this.requiresRealTimeInventory) {
                this.cartService.getRealTimeInventory(this.cart).then(
                    (realTimeInventory: RealTimeInventoryModel) => this.getRealTimeInventoryCompleted(realTimeInventory),
                    (error: any) => this.getRealTimeInventoryFailed(error));
            }
        }

        protected getRealTimeInventoryCompleted(realTimeInventory: RealTimeInventoryModel): void {
        }

        protected getRealTimeInventoryFailed(error: any): void {
            this.failedToGetRealTimeInventory = true;
        }

        emptyCart(emptySuccessUri: string): void {
            this.cartService.removeCart(this.cart).then(
                () => { this.emptyCartCompleted(); },
                (error: any) => { this.emptyCartFailed(error); });
        }

        protected emptyCartCompleted(): void {
        }

        protected emptyCartFailed(error: any): void {
        }

        saveCart(saveSuccessUri: string, signInUri: string): void {
            if (!this.cart.isAuthenticated) {
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

        submitRequisition(submitRequisitionSuccessUri: string): void {
            this.cart.status = "RequisitionSubmitted";
            this.cartService.submitRequisition(this.cart).then(
                (cart: CartModel) => this.submitRequisitionCompleted(submitRequisitionSuccessUri, cart),
                (error: any) => { this.submitRequisitionFailed(error); });
        }

        protected submitRequisitionCompleted(submitRequisitionSuccessUri: string, cart: CartModel): void {
            this.cartService.getCart();
            this.coreService.redirectToPath(submitRequisitionSuccessUri);
        }

        protected submitRequisitionFailed(error: any): void {
        }

        continueShopping($event): void {
            const referrer = this.coreService.getReferringPath();
            if (typeof(referrer) !== "undefined" && referrer !== null) {
                $event.preventDefault();
                this.coreService.redirectToPath(referrer);
            }
        }
    }

    angular
        .module("insite")
        .controller("CartController", CartController);
}