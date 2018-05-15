module nbf.SocialMedia {
    "use strict";

    export class NbfSocialMediaController {
        url: string;

        static $inject = ["$element", "$scope", "$window", "$anchorScroll", "coreService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected $anchorScroll: ng.IAnchorScrollService,
            protected coreService: insite.core.ICoreService) {
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