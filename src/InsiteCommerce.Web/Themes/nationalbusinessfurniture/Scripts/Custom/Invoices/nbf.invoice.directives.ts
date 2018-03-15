module insite.rfq {
    "use strict";

    angular
        .module("insite")
        .directive("nbfRecentInvoices", () => ({
            restrict: "E",
            replace: true,
            scope: {
                isSalesPerson: "="
            },
            templateUrl: "/PartialViews/Custom-Invoices-NbfRecentInvoices",
            controller: "RecentInvoicesController",
            controllerAs: "vm",
            bindToController: true
        }));
}