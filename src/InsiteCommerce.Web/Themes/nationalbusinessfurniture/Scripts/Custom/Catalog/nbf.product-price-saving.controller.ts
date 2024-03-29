﻿module insite.catalog {
    "use strict";

    export class NbfProductPriceSavingController extends ProductPriceSavingController {
        showPriceSaving(product: ProductDto): boolean {
            const unitNetPrice = this.productPriceService.getUnitNetPrice(product);
            if (unitNetPrice) {
                this.unitNetPrice = unitNetPrice.price;
            }
            this.unitNetPriceDisplay = unitNetPrice.priceDisplay;
            const unitListPrice = this.productPriceService.getUnitListPrice(product);
            this.unitListPrice = unitListPrice.price;
            this.unitListPriceDisplay = unitListPrice.priceDisplay;

            return this.unitNetPrice < this.unitListPrice;
        }

        showPriceSavingForOrderHistory(orderLine: OrderLineModel): boolean {
            if (orderLine) {
                this.unitNetPrice = orderLine.unitNetPrice;
                this.unitNetPriceDisplay = orderLine.unitNetPriceDisplay;
                this.unitListPrice = orderLine.unitListPrice;
                this.unitListPriceDisplay = orderLine.unitListPriceDisplay;
            }

            return this.unitNetPrice < this.unitListPrice;
        }
    };

    angular
        .module("insite")
        .controller("ProductPriceSavingController", NbfProductPriceSavingController);
}