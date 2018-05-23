module nbf.WebCode {
    "use strict";

    export class NbfWebCodeController {
        webCode: string;

        static $inject = ["$scope", "nbfWebCodeService", "$rootScope"];

        constructor(
            protected $scope: ng.IScope,
            protected nbfWebCodeService: WebCode.INbfWebCodeService,
            protected $rootScope: ng.IRootScopeService) {
            this.init();
        }

        init(): void {
            this.getWebCode();
        }

        getWebCode(): void {
            this.nbfWebCodeService.getWebCode().then(
                (webCode: string) => { this.getWebCodeCompleted(webCode); },
                (error: any) => { this.getWebCodeFailed(error); });
        }

        protected getWebCodeCompleted(webCode: string): void {
            if (webCode != null) {
                this.webCode = webCode;
                this.$rootScope.$broadcast("AnalyticsEvent", "MiniCartHover");
            } 
        }

        protected getWebCodeFailed(error?: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfWebCodeController", NbfWebCodeController);
}