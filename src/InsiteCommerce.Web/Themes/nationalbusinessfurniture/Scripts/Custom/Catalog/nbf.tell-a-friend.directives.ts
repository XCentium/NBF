module insite.catalog {
    "use strict";

    angular
        .module("insite")
        .directive("nbfTellAFriendPopup", () => ({
            restrict: "E",
            replace: true,
            scope: {
            },
            templateUrl: "productDetail_tellAFriend",
            controller: "NbfTellAFriendController",
            controllerAs: "vm",
            bindToController: true
        }))
        .directive("nbfTellAFriendFooterPopup", () => ({
            restrict: "E",
            replace: true,
            scope: {
            },
            templateUrl: "productDetailFooter_tellAFriend",
            controller: "NbfTellAFriendController",
            controllerAs: "vm",
            bindToController: true
        }));        
}