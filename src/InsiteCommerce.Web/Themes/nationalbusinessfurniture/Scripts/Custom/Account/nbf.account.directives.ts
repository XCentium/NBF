module nbf.account {
    "use strict";

    angular
        .module("insite")
        .directive("nbfAddressEdit", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Account-NbfAddressEdit",
            scope: {
                prefix: "@",
                address: "=",
                countries: "=",
                setStateRequiredRule: "&",
                isReadOnly: "=",
                isEmailReadOnly: "=",
                addressFields: "="
            }
        }))
        .directive("nbfSignInWidget", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Account-NbfSignInWidget",
            scope: {
                includeForgotPasswordLink: "=",
                allowCreateAccount: "="
            },
            controller: "SignInWidgetController",
            controllerAs: "vm"
        }))
        .directive("nbfSignInFlyOut", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Account-NbfSignInFlyOut",
            scope: {
                includeForgotPasswordLink: "=",
                allowCreateAccount: "="
            },
            controller: "SignInFlyOutController",
            controllerAs: "vm"
        }));
}