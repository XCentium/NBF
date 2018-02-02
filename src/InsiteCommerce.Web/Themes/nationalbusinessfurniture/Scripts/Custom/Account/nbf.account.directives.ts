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
                addressFields: "="
            }
        }));
}