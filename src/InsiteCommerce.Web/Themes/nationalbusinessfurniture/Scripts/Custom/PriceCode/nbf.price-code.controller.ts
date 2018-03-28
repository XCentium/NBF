module nbf.PriceCode {
    "use strict";

    export class NbfPriceCodeController {
        priceCode: string;

        static $inject = ["$scope", "nbfPriceCodeService"];

        constructor(
            protected $scope: ng.IScope,
            protected nbfPriceCodeService: PriceCode.INbfPriceCodeService) {
            this.init();
        }

        init(): void {
            this.getPriceCode();
        }

        getPriceCode(): void {
            this.nbfPriceCodeService.getPriceCode().then(
                (priceCode: string) => { this.getPriceCodeCompleted(priceCode); },
                (error: any) => { this.getPriceCodeFailed(error); });
        }

        protected getPriceCodeCompleted(priceCode: string): void {
            if (priceCode != null) {
                this.priceCode = priceCode;
            } 
        }

        protected getPriceCodeFailed(error?: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfPriceCodeController", NbfPriceCodeController);
}