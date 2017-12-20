interface JQuery {
    flexslider: any;
}

module insite.catalog {
    "use strict";

    angular
        .module("insite")
        .directive("iscCrossSellCarousel", () => ({
            restrict: "E",
            replace: true,
            scope: {
                productCrossSell: "@",
                product: "=",
                maxTries: "@"
            },
            templateUrl: "/PartialViews/Catalog-CrossSellCarousel",
            controller: "CrossSellCarouselController",
            controllerAs: "vm",
            bindToController: true
        }));
}