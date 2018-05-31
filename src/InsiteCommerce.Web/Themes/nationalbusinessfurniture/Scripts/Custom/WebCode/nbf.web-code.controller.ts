module nbf.WebCode {
    "use strict";

    export class NbfWebCodeController {
        webCode: string;
        userId: string;

        static $inject = ["$scope", "nbfWebCodeService"];

        constructor(
            protected $scope: ng.IScope,
            protected nbfWebCodeService: WebCode.INbfWebCodeService) {
            this.init();
        }

        init(): void {
            this.getWebCode();
           
        }
       
        getWebCode(): void {
            this.nbfWebCodeService.getWebCode(this.userId).then(
                (webCode: string) => { this.getWebCodeCompleted(webCode); },
                (error: any) => { this.getWebCodeFailed(error); });
        }
      
        getWebCodeCompleted(webCode: string): void {
            if (webCode != null) {
                this.webCode = webCode;
            } 
        }
        getWebUserCompleted(webCode: string): void {
            if (webCode != null) {
                this.webCode = webCode;
            }
        }
        protected getWebCodeFailed(error?: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfWebCodeController", NbfWebCodeController);
}