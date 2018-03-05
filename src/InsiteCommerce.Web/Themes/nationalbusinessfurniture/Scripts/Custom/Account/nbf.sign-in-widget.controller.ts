module insite.account {
    import IWishListService = wishlist.IWishListService;
    "use strict";

    export interface ISignInWidgetControllerAttributes extends ISignInControllerAttributes {
        forcedRedirectUrl: string;
    }

    export class SignInWidgetController extends SignInController {
        forcedRedirectUrl: string;
        guestCartOrderNum: string;

        static $inject = ["$scope",
            "$window",
            "accountService",
            "sessionService",
            "customerService",
            "coreService",
            "spinnerService",
            "$attrs",
            "settingsService",
            "cartService",
            "queryString",
            "accessToken",
            "$timeout",
            "$localStorage",
            "wishListService",
            "$q",
            "ipCookie"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected $attrs: ISignInWidgetControllerAttributes,
            protected settingsService: core.ISettingsService,
            protected cartService: cart.ICartService,
            protected queryString: common.IQueryStringService,
            protected accessToken: common.IAccessTokenService,
            protected $timeout: ng.ITimeoutService,
            protected $localStorage: common.IWindowStorage,
            protected wishListService: IWishListService,
            protected $q: ng.IQService,
            protected ipCookie: any) {
            super($scope,
                $window,
                accountService,
                sessionService,
                customerService,
                coreService,
                spinnerService,
                $attrs,
                settingsService,
                cartService,
                queryString,
                accessToken,
                $timeout,
                $localStorage,
                wishListService,
                $q);
        }

        init() {
            this.homePageUrl = this.$attrs.homePageUrl;
            this.changeCustomerPageUrl = this.$attrs.changeCustomerPageUrl;
            this.dashboardUrl = this.$attrs.dashboardUrl;
            this.addressesUrl = this.$attrs.addressesUrl;
            this.checkoutAddressUrl = this.$attrs.checkoutAddressUrl;
            this.reviewAndPayUrl = this.$attrs.reviewAndPayUrl;
            this.myListDetailUrl = this.$attrs.myListDetailUrl;
            this.staticListUrl = this.$attrs.staticListUrl;
            this.cartUrl = this.$attrs.cartUrl;
            this.forcedRedirectUrl = this.$attrs.forcedRedirectUrl;

            this.returnUrl = this.queryString.get("returnUrl");
            if (!this.returnUrl) {
                if (!this.forcedRedirectUrl) {
                    this.returnUrl = this.homePageUrl;
                } else {
                    this.returnUrl = this.forcedRedirectUrl;
                }
            }

            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.cart = this.cartService.getLoadedCurrentCart();
            if (!this.cart) {
                this.$scope.$on("cartLoaded", (event: ng.IAngularEvent, cart: CartModel) => { this.onCartLoaded(cart); });
            }

            const lowerCaseReturnUrl = this.returnUrl.toLowerCase();
            if (lowerCaseReturnUrl.indexOf(this.reviewAndPayUrl.toLowerCase()) > -1) {
                this.isFromReviewAndPay = true;
            }

            if (lowerCaseReturnUrl.indexOf(this.myListDetailUrl.toLowerCase()) > -1 && lowerCaseReturnUrl.indexOf("invite") > -1) {
                this.invitedToList = true;
            }

            const idParam = "?id=";
            if (lowerCaseReturnUrl.indexOf(this.staticListUrl.toLowerCase()) > -1 && !this.queryString.get("clientRedirect") && lowerCaseReturnUrl.indexOf(idParam) > -1) {
                this.listId = lowerCaseReturnUrl.substr(lowerCaseReturnUrl.indexOf(idParam) + idParam.length, 36);
                this.navigatedFromStaticList = true;
            }

            this.isFromCheckoutAddress = lowerCaseReturnUrl.indexOf(this.checkoutAddressUrl.toLowerCase()) > -1;
        }

        protected signOutIfGuestSignedIn(): ng.IPromise<string> {
            if (this.session.isAuthenticated && this.session.isGuest) {
                if (this.cart.cartLines.length > 0) {
                    this.guestCartOrderNum = this.cart.orderNumber;
                }
                return this.sessionService.signOut();
            }
            const defer = this.$q.defer<string>();
            defer.resolve();
            return defer.promise;
        }

        protected signOutIfGuestSignedInCompleted(signOutResult: string): void {
            if (this.guestCartOrderNum) {
                this.ipCookie("guestCartId", this.guestCartOrderNum);
            }
            this.accessToken.remove();
            this.accessToken.generate(this.userName, this.password).then(
                (accessTokenDto: common.IAccessTokenDto) => { this.generateAccessTokenOnSignInCompleted(accessTokenDto); },
                (error: any) => { this.generateAccessTokenOnSignInFailed(error); });
        }

        protected signOutIfGuestSignedInFailed(error: any): void {
            this.signInError = error.message;
            this.disableSignIn = false;
            this.spinnerService.hide("mainLayout");
        }
    }

    angular
        .module("insite")
        .controller("SignInWidgetController", SignInWidgetController);
}