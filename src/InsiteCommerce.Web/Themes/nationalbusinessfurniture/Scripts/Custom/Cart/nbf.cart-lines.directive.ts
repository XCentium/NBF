module nbf.cart {
    "use strict";

    angular
        .module("insite")
        .directive("nbfCartLines", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Cart-NbfCheckoutCartLines",
            scope: {
                cart: "=",
                promotions: "=",
                inventoryCheck: "@",
                includeInventory: "@",
                includeQuoteRequired: "=",
                failedToGetRealTimeInventory: "="
            },
            controller: "CartLinesController",
            controllerAs: "vm",
            link: ($scope: any, element, attrs) => {
                $scope.editable = attrs.editable === "true";
                $scope.quoteRequiredFilter = (value) => {
                    if ($scope.includeQuoteRequired) {
                        return true;
                    }
                    return value.quoteRequired === false;
                };
            }
        }));
}