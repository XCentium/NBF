﻿module insite.core {
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
        }));
}