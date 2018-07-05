module insite.catalog {

    export class NbfProductPriceController extends ProductPriceController {

        static $inject = ["productPriceService"];

        constructor(protected productPriceService: IProductPriceService) {
            super(productPriceService);
        }

        nbfUnitNetPriceDisplay(product, isFOB: boolean = false, $scope: ng.IScope = null): string {
            if (!isFOB) {
                return this.productPriceService.getUnitNetPrice(product).priceDisplay;
            }
            var freight = parseFloat(product.properties['freight']);
            var unitPrice = this.productPriceService.getUnitNetPrice(product).price + (isNaN(freight) ? 0 : freight);
            var currencySymbol = product.currencySymbol ? product.currencySymbol : "$";
            return currencySymbol + unitPrice.toFixed(2).toString();
        }

    }

    angular
        .module('insite')
        .controller('NbfProductPriceController', NbfProductPriceController)
        .directive('nbfProductPrice', () => ({
            controller: "NbfProductPriceController",
            controllerAs: "vm",
            restrict: "E",
            scope: {
                product: "=",
                idKey: "@",
                hideSalePriceLabel: "@",
                isFob: "="
            },
            templateUrl: "/PartialViews/Custom-Catalog-NbfProductPrice"
        }));

}


