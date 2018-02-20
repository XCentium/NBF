module insite.catalog {
    "use strict";

    angular
        .module("insite")
        .directive("nbfSortedAttributeValueList", () => ({
            restrict: "E",
            replace: true,
            scope: {
                attributeTypes: "=",
                maximumNumber: "@"
            },
            templateUrl: "/PartialViews/Custom-Catalog-NbfSortedAttributeValueList"
        }));
}