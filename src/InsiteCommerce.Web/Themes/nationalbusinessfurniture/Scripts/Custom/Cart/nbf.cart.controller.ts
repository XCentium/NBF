module insite.cart {
    "use strict";

    export class NbfCartController extends CartController {
        checkoutPage: string;

        static $inject = ["$scope", "cartService", "promotionService", "settingsService", "coreService", "$localStorage", "addToWishlistPopupService", "spinnerService", "accountService", "sessionService", "accessToken", "$window"];
        
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
            protected accessToken: common.IAccessTokenService,
            protected $window: ng.IWindowService ) {
            super($scope, cartService, promotionService, settingsService, coreService, $localStorage);
            
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
    }

    angular
        .module("insite")
        .controller("CartController", NbfCartController);
}