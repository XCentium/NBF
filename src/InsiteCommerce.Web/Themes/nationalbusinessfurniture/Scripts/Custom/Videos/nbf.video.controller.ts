module nbf.video {
    "use strict";

    export class NbfVideoController {
        video: any;

        static $inject = ["$scope"];

        constructor(
            protected $scope: ng.IScope) {
            this.init();
        }

        init(): void {
            
        }

        toggleVideo(videoId: string) {
            this.video = document.getElementById(videoId);

            this.video["paused"] ? this.play() : this.pause();

            this.video.onended = (): void => {
                $(".playbtn").show();
            };
        }

        protected play() {
            this.video["play"]();
            $(".playbtn").hide();
        }

        protected pause() {
            this.video["pause"]();
            $(".playbtn").show();
        }
    }

    angular
        .module("insite")
        .controller("NbfVideoController", NbfVideoController);
}