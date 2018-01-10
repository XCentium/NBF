module insite.cart {
    "use strict";

    angular
        .module("insite")
        .directive("nbfCartLines", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Cart-CheckoutCartLines",
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