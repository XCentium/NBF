module insite.layout {
    "use strict";

    export class NbfHeaderController {
        cart: CartModel;
        session: any;
        isVisibleSearchInput = false;
        checkoutPage: string;

        static $inject = ["$scope", "$timeout", "cartService", "sessionService", "$window", "coreService", "$localStorage", "spinnerService", "accountService", "accessToken", '$rootScope'];

        constructor(
            protected $scope: ng.IScope,
            protected $timeout: ng.ITimeoutService,
            protected cartService: cart.ICartService,
            protected sessionService: account.ISessionService,
            protected $window: ng.IWindowService,
            protected coreService: core.ICoreService,
            protected $localStorage: common.IWindowStorage,
            protected spinnerService: core.ISpinnerService,
            protected accountService: account.IAccountService,
            protected accessToken: common.IAccessTokenService,
            protected $rootScope: ng.IRootScopeService
        ) {
            this.init();
        }

        init(): void {
            this.$scope.$on("cartLoaded", (event, cart) => {
                this.onCartLoaded(cart);
            });

            // use a short timeout to wait for anything else on the page to call to load the cart
            this.$timeout(() => {
                if (!this.cartService.cartLoadCalled) {
                    this.getCart();
                }
            }, 20);

            this.getSession();

            // set min-width of the Search label
            angular.element(".header-b2c .header-zone.rt .sb-search").css("min-width", angular.element(".search-label").outerWidth());
        }

        protected onCartLoaded(cart: CartModel): void {
            this.cart = cart;
            this.$rootScope.$broadcast("setAnalyticsCart", cart);
        }

        protected getCart(): void {
            this.cartService.expand = "cartlines";
            this.cartService.getCart().then(
                (cart: CartModel) => { this.getCartCompleted(cart); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getCartCompleted(cart: CartModel): void {
        }

        protected getCartFailed(error: any): void {
        }

        protected getSession(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
        }

        protected getSessionFailed(error: any): void {
        }

        protected openSearchInput(): void {
            this.isVisibleSearchInput = true;
            this.$timeout(() => {
                angular.element(".sb-search input#isc-searchAutoComplete-b2c").focus();
            }, 500);
        }

        signOut(returnUrl: string): void {
            this.sessionService.signOut().then(
                (signOutResult: string) => { this.signOutCompleted(signOutResult, returnUrl); },
                (error: any) => { this.signOutFailed(error); });
        }

        protected signOutCompleted(signOutResult: string, returnUrl: string): void {
            this.$window.location.href = returnUrl;
        }

        protected signOutFailed(error: any): void {
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

        protected saveCartCompleted(saveSuccessUri: string, cart: CartModel): void {
            this.cartService.getCart();
            if (cart.id !== "current") {
                this.coreService.redirectToPath(`${saveSuccessUri}?cartid=${cart.id}`);
            }
        }

        protected saveCartFailed(error: any): void {
        }

        removeLine(cartLine: CartLineModel): void {
            this.cartService.removeLine(cartLine).then(
                () => { this.removeLineCompleted(cartLine); }, // the cartLine returned from the call will be null if successful, instead, send in the cartLine that was removed
                (error: any) => { this.removeLineFailed(error); });
        }

        protected removeLineCompleted(cartLine: CartLineModel): void {
        }

        protected removeLineFailed(error: any): void {
        }
        flyOutFocusOff(): void {
            $('.user-nav .sub-tier-panel').removeAttr("style");
            var $activeElement = angular.element(document.activeElement);
            $activeElement.blur();
        }

        protected requestQuote(uri: string): void {
            this.$rootScope.$broadcast("initAnalyticsEvent", "MiniCartQuoteRequest");
            window.location.href = uri;

        }

    }

    angular
        .module("insite")
        .controller("NbfHeaderController", NbfHeaderController);
}