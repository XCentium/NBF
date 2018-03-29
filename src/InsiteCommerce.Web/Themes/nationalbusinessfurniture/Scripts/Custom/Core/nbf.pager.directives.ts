module insite.core {
    "use strict";

    angular
        .module("insite")
        .directive("nbfPager", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Core-Pager",
            scope: {
                pagination: "=",
                bottom: "@",
                updateData: "&",
                customContext: "=",
                storageKey: "=",
                pageChanged: "&",
                perPage: "=?"
            },
            controller: "NbfPagerController",
            controllerAs: "vm",
            bindToController: true
        }))
        .directive("nbfItemListPager", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Core-Item-List-Pager",
            scope: {
                pagination: "=",
                bottom: "@",
                updateData: "&",
                customContext: "=",
                storageKey: "=",
                pageChanged: "&",
                perPage: "=?"
            },
            controller: "NbfPagerController",
            controllerAs: "vm",
            bindToController: true
        }))
        .directive("nbfProductListPager", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Core-Product-List-Pager",
            scope: {
                pagination: "=",
                bottom: "@",
                updateData: "&",
                customContext: "=",
                storageKey: "=",
                pageChanged: "&",
                perPage: "=?"
            },
            controller: "NbfPagerController",
            controllerAs: "vm",
            bindToController: true
        }))
        .directive("nbfContentPager", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Content-ContentPager",
            scope: {},
            controller: "ContentPagerController",
            controllerAs: "vm",
            bindToController: true
        }));
}