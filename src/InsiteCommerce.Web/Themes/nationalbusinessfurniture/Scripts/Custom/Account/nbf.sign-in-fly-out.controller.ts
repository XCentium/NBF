module insite.account {
    import IWishListService = wishlist.IWishListService;
    "use strict";

    export class SignInFlyOutController extends SignInWidgetController {
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
                $q,
                ipCookie);
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
            //if (session.isAuthenticated && !session.isGuest) {
            //    this.$window.location.href = this.dashboardUrl;
            //} else if (this.invitedToList) {
            //    this.coreService.displayModal("#popup-sign-in-required");
            //} else if (this.navigatedFromStaticList) {
            //    this.getList();
            //}
        }
    }

    angular
        .module("insite")
        .controller("SignInFlyOutController", SignInFlyOutController);
}