module insite.cart {
    "use strict";

    export class NbfCartController extends CartController {
        checkoutPage: string;
        cartId: string;
        promotionAppliedMessage: string;
        promotionErrorMessage: string;
        promotionCode: string;
        isGSA: boolean = false;
        usingFOBPricing: boolean = false;

        static $inject = ["$scope", "cartService", "promotionService", "settingsService", "coreService", "$localStorage", "addToWishlistPopupService", "spinnerService", "accountService", "sessionService", "productService", "accessToken",
            "queryString", "$window", "$rootScope", "nbfPriceCodeService"];
        
        constructor(
            protected $scope: ICartScope,
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected settingsService: core.ISettingsService,
            protected coreService: core.ICoreService,
            protected $localStorage: common.IWindowStorage,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected spinnerService: core.ISpinnerService,
            protected accountService: account.IAccountService,
            protected sessionService: account.ISessionService,
            protected productService: insite.catalog.IProductService,
            protected accessToken: common.IAccessTokenService,
            protected queryString: common.IQueryStringService,
            protected $window: ng.IWindowService,
            protected $rootScope: ng.IRootScopeService,
            protected nbfPriceCodeService: nbf.PriceCode.INbfPriceCodeService
        ) {
            super($scope, cartService, promotionService, settingsService, coreService, $localStorage, addToWishlistPopupService, spinnerService);
            var self = this;
            sessionService.getSession().then(session => {
                nbfPriceCodeService.getPriceCode(session.billTo.id).then(contract => {
                    self.isGSA = contract.value === "GSA";
                    self.usingFOBPricing = self.isGSA;
                });
            });

        }

        init(): void {
            super.init();
            this.$scope.$root.$broadcast("AnalyticsEvent", "CartView");
        }

        protected getCart(): void {
            this.cartService.expand = "cartlines,shipping,tax,carriers,paymentoptions";
            if (this.settings.showTaxAndShipping) {
                this.cartService.expand += ",shipping,tax";
            }
            const hasRestrictedProducts = this.$localStorage.get("hasRestrictedProducts");
            if (hasRestrictedProducts === true.toString()) {
                this.cartService.expand += ",restrictions";
            }
            this.spinnerService.show();
            this.cartService.getCart().then(
                (cart: CartModel) => { this.getCartCompleted(cart); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getCartCompleted(cart: CartModel): void {
            this.$rootScope.$broadcast("AnalyticsCart", cart);
            this.cartService.expand = "";
            if (!cart.cartLines.some(o => o.isRestricted)) {
                this.$localStorage.remove("hasRestrictedProducts");
                this.productsCannotBePurchased = false;
            } else {
                this.productsCannotBePurchased = true;
            }

            this.cartId = this.queryString.get("cartId") || "current";

            cart.cartLines.forEach(cartLine => {
                var split = cartLine.shortDescription.split(" - ");
                var name = split[0];
                var details = split[1];

                if (name && details) {
                    cartLine.shortDescription = name;
                    //cartLine.properties["details"] = details;
                }                
            }); 

            this.updateCartlinesWithAttributes(cart);

            this.updateSwatchCartlinesWithBaseProductUrl(cart);
            
            this.displayCart(cart);
        }

        updateSwatchCartlinesWithBaseProductUrl(cart: CartModel) {
            let baseProductErpNumbers = cart.cartLines
                .filter(x => x.erpNumber.indexOf(":") >= 0)
                .map(x => x.erpNumber.split(":")[0]);

            if (baseProductErpNumbers.length > 0) {
                const expand = ["attributes"];
                const parameter: insite.catalog.IProductCollectionParameters = { erpNumbers: baseProductErpNumbers };
                this.productService.getProducts(parameter, expand).then(
                    (productCollection: ProductCollectionModel) => {
                        cart.cartLines.forEach(cartLine => {
                            if (cartLine.erpNumber.indexOf(":") > 0) {
                                let erpNumber = cartLine.erpNumber.split(":")[0];
                                let baseProduct = productCollection.products.find(x => x.erpNumber === erpNumber);

                                if (baseProduct) {
                                    cartLine.productUri = baseProduct.productDetailUrl;
                                    this.cartService.updateLine(cartLine, false);
                                }
                            }
                        });

                        //this.$scope.$apply();
                    },
                    (error: any) => { });
            }
        }

        updateCartlinesWithAttributes(cart: CartModel) {
            let baseProductErpNumbers = cart.cartLines.map(x => x.erpNumber.split("_")[0]);
            const expand = ["attributes"];
            const parameter: insite.catalog.IProductCollectionParameters = { erpNumbers: baseProductErpNumbers };
            this.productService.getProducts(parameter, expand).then(
                (productCollection: ProductCollectionModel) => {
                    cart.cartLines.forEach(cartLine => {
                        let erpNumber = cartLine.erpNumber.split("_")[0];
                        let baseProduct = productCollection.products.find(x => x.erpNumber === erpNumber);

                        if (baseProduct) {
                            cartLine.properties["GSA"] = this.isAttributeValue(baseProduct, "GSA", "Yes") ? "Yes" : "No";
                            cartLine.properties["ShipsToday"] = this.isAttributeValue(baseProduct, "Ships Today", "Yes") ? "Yes" : "No";
                        }
                    });

                    //this.$scope.$apply();
                },
                (error: any) => { });
        }
        
        saveCart(saveSuccessUri: string, signInUri: string): void {
            
            this.$rootScope.$broadcast("AnalyticsEvent", "SaveOrderFromCartPage", null);
            super.saveCart(saveSuccessUri, signInUri);
        }

        displayCart(cart: CartModel): void {
            this.cart = cart;

            if ((!this.cart.billTo || this.cart.shipTo) && this.cart.totalTax === 0) {
                this.cart.totalTaxDisplay = "TBD";
            }

            //this.canAddAllToList = this.cart.cartLines.every(l => l.canAddToWishlist);
            //disable adding to favorites as this should be done using heart icon only
            this.canAddAllToList = false;
            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => { this.getCartPromotionsCompleted(promotionCollection); },
                (error: any) => { this.getCartPromotionsFailed(error); });
        }

        checkout(checkoutPage: string) {
            this.checkoutPage = checkoutPage;

            this.spinnerService.show("mainLayout", true);

            this.sessionService.getIsAuthenticated().then(
                (authenticated: boolean) => {
                    if (!authenticated) {
                        this.guestCheckout();
                    } else {
                        this.$window.location.href = this.checkoutPage;
                    }
                });
        }

        guestCheckout(): void {
            const account = { isGuest: true } as AccountModel;

            this.accountService.createAccount(account).then(
                (createdAccount: AccountModel) => { this.createAccountCompleted(createdAccount); },
                (error: any) => { this.createAccountFailed(error); });
        }

        protected createAccountCompleted(account: AccountModel): void {
            this.$localStorage.set("guestId", account.password);
            this.accessToken.generate(account.userName, account.password).then(
                (accessTokenDto: common.IAccessTokenDto) => { this.generateAccessTokenForAccountCreationCompleted(accessTokenDto); },
                (error: any) => { this.generateAccessTokenForAccountCreationFailed(error); });
        }

        protected createAccountFailed(error: any): void {
            //Something went wrong
        }

        protected generateAccessTokenForAccountCreationCompleted(accessTokenDto: common.IAccessTokenDto): void {
            this.accessToken.set(accessTokenDto.accessToken);
            this.$window.location.href = this.checkoutPage;
        }

        protected generateAccessTokenForAccountCreationFailed(error: any): void {
            //something went wrong
        }


        applyPromotion(): void {
            this.promotionAppliedMessage = "";
            this.promotionErrorMessage = "";

            this.promotionService.applyCartPromotion(this.cartId, this.promotionCode).then(
                (promotion: PromotionModel) => { this.applyPromotionCompleted(promotion); },
                (error: any) => { this.applyPromotionFailed(error); });
        }

        protected applyPromotionCompleted(promotion: PromotionModel): void {
            if (promotion.promotionApplied) {
                this.promotionAppliedMessage = promotion.message;
                this.$rootScope.$broadcast("AnalyticsEvent", "PromoApplied", null, null, promotion.promotionCode);
            } else {
                this.promotionErrorMessage = promotion.message;
            }

            this.getCart();
        }

        protected applyPromotionFailed(error: any): void {
            this.promotionErrorMessage = error.message;
            this.getCart();
        }

        protected isAttributeValue(product: ProductDto, attrName: string, attrValue: string): boolean {
            let retVal = false;

            if (product && product.attributeTypes) {
                const attrType = product.attributeTypes.find(x => x.name === attrName && x.isActive === true);

                if (attrType) {
                    const matchingAttrValue = attrType.attributeValues.find(y => y.value === attrValue);

                    if (matchingAttrValue) {
                        retVal = true;
                    }
                }
            }
            return retVal;
        }

        continueShopping($event): void {
            this.$rootScope.$broadcast("AnalyticsEvent", "ContinueShoppingFromCartPage");
        }

        toggleFOBPricing() {
            this.usingFOBPricing = !this.usingFOBPricing;
        }
    }

    angular
        .module("insite")
        .filter("negate", (): (promoVal: any) => string => promoVal => `- ${promoVal}`)
        .controller("CartController", NbfCartController);
}