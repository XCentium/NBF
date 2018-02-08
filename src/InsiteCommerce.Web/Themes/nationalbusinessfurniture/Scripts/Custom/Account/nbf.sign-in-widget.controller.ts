module insite.account {
    "use strict";

    export class SignInWidgetController extends insite.account.SignInController {
        accessTokenString = "";
        changePasswordError: string;
        email: string;
        homePageUrl: string;
        changeCustomerPageUrl: string;
        dashboardUrl: string;
        newPassword: string;
        password: string;
        resetPasswordError: string;
        resetPasswordSuccess: boolean;
        returnUrl: string;
        checkoutAddressUrl: string;
        reviewAndPayUrl: string;
        myListDetailUrl: string;
        staticListUrl: string;
        cartUrl: string;
        addressesUrl: string;
        settings: AccountSettingsModel;
        signInError = "";
        disableSignIn = false;
        userName: string;
        userNameToReset: string;
        cart: CartModel;
        signInForm: any;
        isFromReviewAndPay: boolean;
        rememberMe: boolean;
        invitedToList: boolean;
        navigatedFromStaticList: boolean;
        listOwner: string;
        listId: string;
        isFromCheckoutAddress: boolean;
        session: SessionModel;

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
            if (session.isAuthenticated && !session.isGuest) {
                this.$window.location.href = this.dashboardUrl;
            } else if (this.invitedToList) {
                this.coreService.displayModal("#popup-sign-in-required");
            } else if (this.navigatedFromStaticList) {
                super.getList();
            }
        }

    }

    angular
        .module("insite")
        .controller("SignInWidgetController", SignInWidgetController);
}