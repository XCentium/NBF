module insite.cart {
    "use strict";

    angular
        .module("insite")
        .directive("nbfOrderTrackerOrderDetailView", () => ({
            restrict: "E",
            templateUrl: "/PartialViews/Custom-OrderTracker-OrderTrackerOrderDetailView",
            scope: {
                order: "="
            },
            controller: "NbfOrderTrackerOrderDetailController",
            controllerAs: "vm"
        }));
}