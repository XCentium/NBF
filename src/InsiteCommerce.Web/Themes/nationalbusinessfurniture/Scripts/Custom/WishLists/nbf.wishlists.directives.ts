module nbf.wishlists {
    "use strict";

    angular
        .module("insite")
        .directive("nbfFavoritesQuickView", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-WishLists-NbfFavoritesQuickView",
            controller: "MyListDetailController",
            controllerAs: "vm"
        }));
}