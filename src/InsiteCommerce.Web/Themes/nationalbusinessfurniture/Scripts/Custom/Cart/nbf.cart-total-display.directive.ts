﻿module nbf.cart {
    "use strict";

    angular
        .module("insite")
        .directive("nbfCartTotalDisplay", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Cart-NbfCheckoutCartTotalDisplay",
            scope: {
                cart: "=",
                promotions: "=",
                orderTaxes: "=",
                isCartPage: "=",
                showSeparateShippingAndHandling: "=",
                showMiscCharge: "=",
                showDiscountTotal: "=",
                label: "=",
                fobPricing: "="
            },
            link: ($scope: any) => {
                $scope.discountOrderFilter = promotion =>
                    (promotion.promotionResultType === "AmountOffOrder" || promotion.promotionResultType === "PercentOffOrder");
                $scope.discountShippingFilter = promotion =>
                    (promotion.promotionResultType === "AmountOffShipping" || promotion.promotionResultType === "PercentOffShipping");
                $scope.discountTotal = (promotions, currencySymbol) => {
                    let discountTotal = 0;
                    if (promotions) {
                        promotions.forEach(promotion => {
                            if (promotion.promotionResultType === "AmountOffOrder" || promotion.promotionResultType === "PercentOffOrder"
                                || promotion.promotionResultType === "AmountOffShipping" || promotion.promotionResultType === "PercentOffShipping") {
                                discountTotal += promotion.amount;
                            }
                        });
                    }

                    return currencySymbol + discountTotal.toFixed(2);
                };
                $scope.getFobPricing = cart => cart ? "$" + (cart.orderSubTotal + cart.shippingAndHandling).toFixed(2) : null;
            }
        }));
}