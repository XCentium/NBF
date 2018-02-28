module nbf.SocialMedia {
    "use strict";

    export class NbfSocialMediaController {
        url: string;

        static $inject = ["$element", "$scope", "$window"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService) {
            this.init();
        }

        init(): void {
            this.url = window.location.href;
        }
    }

    angular
        .module("insite")
        .controller("NbfSocialMediaController", NbfSocialMediaController);
}