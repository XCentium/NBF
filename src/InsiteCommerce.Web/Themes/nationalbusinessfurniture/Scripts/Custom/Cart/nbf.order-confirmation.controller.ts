module insite.cart {
    "use strict";

    export class NbfOrderConfirmationController {
        cart: CartModel;
        promotions: PromotionModel[];
        showRfqMessage: boolean;
        order: OrderModel;

        static $inject = ["cartService", "promotionService", "queryString", "orderService", "$scope"];

        constructor(
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected queryString: common.IQueryStringService,
            protected orderService: order.IOrderService,
            protected $scope: ng.IScope) {
            this.init();
        }

        init(): void {
            this.$scope.$on("checkoutComplete", () => {
                this.processCompletedCart();
            });
        }

        processCompletedCart() {
            const confirmedCartId = this.queryString.get("cartId");

            this.cartService.expand = "cartlines,carriers";

            this.cartService.getCart(confirmedCartId).then(
                (confirmedCart: CartModel) => { this.getConfirmedCartCompleted(confirmedCart); },
                (error: any) => { this.getConfirmedCartFailed(error); });

            // get the current cart to update the mini cart
            this.cartService.expand = "";

            this.cartService.getCart().then(
                (cart: CartModel) => { this.getCartCompleted(cart); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getConfirmedCartCompleted(confirmedCart: CartModel): void {
            this.cart = confirmedCart;

            if (window.hasOwnProperty("dataLayer")) {
                const data = {
                    "event": "transactionComplete",
                    "transactionId": this.cart.orderNumber,
                    "transactionAffiliation": this.cart.billTo.companyName,
                    "transactionTotal": this.cart.orderGrandTotal,
                    "transactionTax": this.cart.totalTax,
                    "transactionShipping": this.cart.shippingAndHandling,
                    "transactionProducts": []
                };

                const cartLines = this.cart.cartLines;
                for (let key in cartLines) {
                    if (cartLines.hasOwnProperty(key)) {
                        const cartLine = cartLines[key];
                        data.transactionProducts.push({
                            "sku": cartLine.erpNumber,
                            "name": cartLine.shortDescription,
                            "price": cartLine.pricing.unitNetPrice,
                            "quantity": cartLine.qtyOrdered
                        });
                    }
                }

                (window as any).dataLayer.push(data);
            }

            this.orderService.getOrder(this.cart.orderNumber, "").then(
                (order: OrderModel) => { this.getOrderCompleted(order); },
                (error: any) => { this.getCartFailed(error); });

            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => { this.getCartPromotionsCompleted(promotionCollection); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getConfirmedCartFailed(error: any): void {
        }

        protected getOrderCompleted(orderHistory: OrderModel): void {
            this.order = orderHistory;
        }

        protected getOrderFailed(error: any): void {
        }

        protected getCartPromotionsCompleted(promotionCollection: PromotionCollectionModel): void {
            this.promotions = promotionCollection.promotions;
        }

        protected getCartPromotionsFailed(error: any): void {
        }

        protected getCartCompleted(cart: CartModel): void {
            this.showRfqMessage = cart.canRequestQuote && cart.quoteRequiredCount > 0;
        }

        protected getCartFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfOrderConfirmationController", NbfOrderConfirmationController);
}