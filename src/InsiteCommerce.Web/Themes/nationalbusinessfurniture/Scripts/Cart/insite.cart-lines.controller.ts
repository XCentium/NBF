module insite.cart {
    "use strict";

    export class CartLinesController {
        openLineNoteId = "";
        isUpdateInProgress = false;

        static $inject = ["$scope", "cartService", "productSubscriptionPopupService", "spinnerService"];

        constructor(
            protected $scope: ICartScope,
            protected cartService: ICartService,
            protected productSubscriptionPopupService: catalog.ProductSubscriptionPopupService,
            protected spinnerService: core.ISpinnerService) {
            this.init();
        }

        init(): void {
            this.$scope.$on("cartLoaded", (event: ng.IAngularEvent, cart: CartModel) => this.onCartLoaded(event, cart));

            this.$scope.$on("updateProductSubscription", (event: ng.IAngularEvent, productSubscription: ProductSubscriptionDto, product: ProductDto, cartLine: CartLineModel) =>
                this.onUpdateProductSubscription(event, productSubscription, product, cartLine));
        }

        protected onCartLoaded(event: ng.IAngularEvent, cart: CartModel): void {
            this.isUpdateInProgress = false;
        }

        protected onUpdateProductSubscription(event: ng.IAngularEvent, productSubscription: ProductSubscriptionDto, product: ProductDto, cartLine: CartLineModel): void {
            const productSubscriptionCustomPropertyName = "ProductSubscription";
            cartLine.properties[productSubscriptionCustomPropertyName] = JSON.stringify(productSubscription);
            this.updateLine(cartLine, true);
        }

        updateLine(cartLine: CartLineModel, refresh: boolean): void {
            if (refresh) {
                this.isUpdateInProgress = true;
            }
            if (parseFloat(cartLine.qtyOrdered.toString()) === 0) {
                this.removeLine(cartLine);
            } else {
                this.spinnerService.show();
                this.cartService.updateLine(cartLine, refresh).then(
                    (cartLineModel: CartLineModel) => { this.updateLineCompleted(cartLineModel); },
                    (error: any) => { this.updateLineFailed(error); });
            }
        }

        protected updateLineCompleted(cartLine: CartLineModel): void {
        }

        protected updateLineFailed(error: any): void {
        }

        removeLine(cartLine: CartLineModel): void {
            this.spinnerService.show();
            this.cartService.removeLine(cartLine).then(
                () => { this.removeLineCompleted(cartLine); }, // the cartLine returned from the call will be null if successful, instead, send in the cartLine that was removed
                (error: any) => { this.removeLineFailed(error); });
        }

        protected removeLineCompleted(cartLine: CartLineModel): void {
        }

        protected removeLineFailed(error: any): void {
        }

        quantityKeyPress(keyEvent: KeyboardEvent, cartLine: CartLineModel): void {
            if (keyEvent.which === 13) {
                (keyEvent.target as any).blur();
            }
        }

        notesKeyPress(keyEvent: KeyboardEvent, cartLine: CartLineModel): void {
            if (keyEvent.which === 13) {
                this.updateLine(cartLine, false);
            }
        }

        notePanelClicked(lineId: string): void {
            if (this.openLineNoteId === lineId) {
                this.openLineNoteId = "";
            } else {
                this.openLineNoteId = lineId;
            }
        }

        getSumQtyPerUom(productId: System.Guid, cartLines: CartLineModel[]): number {
            return cartLines.reduce((sum, current) => {
                return current.productId === productId
                    ? sum + current.qtyPerBaseUnitOfMeasure * current.qtyOrdered
                    : sum;
            }, 0);
        }

        openProductSubscriptionPopup(cartLine: CartLineModel): void {
            this.productSubscriptionPopupService.display({ product: null, cartLine: cartLine, productSubscription: null });
        }
    }

    angular
        .module("insite")
        .controller("CartLinesController", CartLinesController);
}