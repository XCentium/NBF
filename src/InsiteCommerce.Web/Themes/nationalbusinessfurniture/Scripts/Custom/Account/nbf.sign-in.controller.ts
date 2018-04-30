module insite.account {
    import IWishListService = wishlist.IWishListService;
    "use strict";

    export class NbfSignInController extends SignInController {

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
            "$q"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected $attrs: ISignInControllerAttributes,
            protected settingsService: core.ISettingsService,
            protected cartService: cart.ICartService,
            protected queryString: common.IQueryStringService,
            protected accessToken: common.IAccessTokenService,
            protected $timeout: ng.ITimeoutService,
            protected $localStorage: common.IWindowStorage,
            protected wishListService: IWishListService,
            protected $q: ng.IQService) {
            super($scope, $window, accountService, sessionService, customerService, coreService, spinnerService, $attrs, settingsService, cartService,
                queryString, accessToken, $timeout, $localStorage, wishListService, $q);
        }
        
        protected signInCompleted(session: SessionModel): void {
            super.signInCompleted(session);
            console.log("signincompleted");
            this.$scope.$broadcast("initAnalyticsEvent", "Login", null, null);
        }
    }

    angular
        .module("insite")
        .controller("SignInController", SignInController);
}