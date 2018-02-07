module insite.account {
    "use strict";

    export class SignInWidgetController extends SignInController {
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


    }

    angular
        .module("insite")
        .controller("SignInWidgetController", SignInWidgetController);
}