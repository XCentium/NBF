module nbf.OrderTracker {
    "use strict";

    export class NbfOrderTrackerOrderDetailController {
        order: OrderModel;
        orderNumber: string;
        canReorderItems = false;
        btFormat: string;
        stFormat: string;
        validationMessage: string;
        showCancelationConfirmation = false;
        showPoNumber: boolean;
        showTermsCode: boolean;
        showOrderStatus: boolean;
        allowCancellationStatuses: string[];
        allowRmaStatuses: string[];
        orderLoaded: boolean = false;
        errorLoadingOrder: boolean = false;

        static $inject = ["orderService", "nbfOrderTrackerService", "settingsService", "queryString", "coreService", "sessionService", "cartService"];

        constructor(
            protected orderService: insite.order.IOrderService,
            protected nbfOrderTrackerService: INbfOrderTrackerService,
            protected settingsService: insite.core.ISettingsService,
            protected queryString: insite.common.IQueryStringService,
            protected coreService: insite.core.ICoreService,
            protected sessionService: insite.account.ISessionService,
            protected cartService: insite.cart.ICartService) {
            this.init();
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: insite.core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.orderNumber = this.queryString.get("orderId");
            if (typeof this.orderNumber === "undefined") {
                // handle "clean urls"
                const pathArray = window.location.pathname.split("/");
                const pathOrderNumber = pathArray[pathArray.length - 1];
                if (pathOrderNumber !== "OrderHistoryDetail") {
                    this.orderNumber = pathOrderNumber;
                }
            }
            if (this.orderNumber) {
                this.getOrder(this.orderNumber);
            } else {
                this.errorLoadingOrder = true;
            }
            
            this.getOrderStatusMappings();
        }

        protected getOrder(orderId: string) {
            this.nbfOrderTrackerService.getOrder(orderId).then(
                (order: OrderModel) => { this.getOrderCompleted(order); },
                (error: any) => { this.getOrderFailed(error); });
        }

        protected getOrderCompleted(order: OrderModel): void {
            this.order = order;
            this.btFormat = this.formatCityCommaStateZip(this.order.billToCity, this.order.billToState, this.order.billToPostalCode);
            this.stFormat = this.formatCityCommaStateZip(this.order.shipToCity, this.order.shipToState, this.order.shipToPostalCode);
            this.orderLoaded = true;
        }

        protected getOrderFailed(error: any): void {

        }

        protected getSettingsCompleted(settingsCollection: insite.core.SettingsCollection): void {
            this.canReorderItems = settingsCollection.orderSettings.canReorderItems;
            this.showPoNumber = settingsCollection.orderSettings.showPoNumber;
            this.showTermsCode = settingsCollection.orderSettings.showTermsCode;
            this.showOrderStatus = settingsCollection.orderSettings.showOrderStatus;
        }

        protected getSettingsFailed(error: any): void {
        }

        getOrderStatusMappings(): void {
            this.orderService.getOrderStatusMappings().then(
                (orderStatusMappingCollection: Insite.Order.WebApi.V1.ApiModels.OrderStatusMappingCollectionModel) => { this.getOrderStatusMappingsCompleted(orderStatusMappingCollection); },
                (error: any) => { this.getOrderStatusMappingsFailed(error); });
        }

        protected getOrderStatusMappingsCompleted(orderStatusMappingCollection: Insite.Order.WebApi.V1.ApiModels.OrderStatusMappingCollectionModel): void {
            this.allowRmaStatuses = [];
            this.allowCancellationStatuses = [];
            for (let i = 0; i < orderStatusMappingCollection.orderStatusMappings.length; i++) {
                if (orderStatusMappingCollection.orderStatusMappings[i].allowRma) {
                    this.allowRmaStatuses.push(orderStatusMappingCollection.orderStatusMappings[i].erpOrderStatus);
                }

                if (orderStatusMappingCollection.orderStatusMappings[i].allowCancellation) {
                    this.allowCancellationStatuses.push(orderStatusMappingCollection.orderStatusMappings[i].erpOrderStatus);
                }
            }
        }

        protected getOrderStatusMappingsFailed(error: any): void {
        }

        allowCancellationCheck(status: string): boolean {
            return this.allowCancellationStatuses && this.allowCancellationStatuses.indexOf(status) !== -1;
        }

        allowRmaCheck(status: string): boolean {
            return this.allowRmaStatuses && this.allowRmaStatuses.indexOf(status) !== -1;
        }

        discountOrderFilter(promotion: Insite.Promotions.WebApi.V1.ApiModels.PromotionModel): boolean {
            if (promotion == null) {
                return false;
            }

            return (promotion.promotionResultType === "AmountOffOrder" || promotion.promotionResultType === "PercentOffOrder");
        }

        discountShippingFilter(promotion: Insite.Promotions.WebApi.V1.ApiModels.PromotionModel): boolean {
            if (promotion == null) {
                return false;
            }

            return (promotion.promotionResultType === "AmountOffShipping" || promotion.promotionResultType === "PercentOffShipping");
        }

        formatCityCommaStateZip(city: string, state: string, zip: string): string {
            let formattedString = "";
            if (city) {
                formattedString += city;
            }

            if (city && state) {
                formattedString += `, ${state} ${zip}`;
            }

            return formattedString;
        }

        reorderProduct($event, line: Insite.Order.WebApi.V1.ApiModels.OrderLineModel): void {
            $event.preventDefault();
            line.canAddToCart = false;
            let reorderItemsCount = 0;
            for (let i = 0; i < this.order.orderLines.length; i++) {
                if (this.order.orderLines[i].canAddToCart) {
                    reorderItemsCount++;
                }
            }

            this.canReorderItems = reorderItemsCount !== 0;
            this.cartService.addLine(this.orderService.convertToCartLine(line), true).then(
                (cartLine: CartLineModel) => { this.addLineCompleted(cartLine); },
                (error: any) => { this.addLineFailed(error); });
        }

        showShareModal(entityId: string): void {
            this.coreService.displayModal(`#shareEntityPopupContainer_${entityId}`);
        }

        protected addLineCompleted(cartLine: Insite.Cart.WebApi.V1.ApiModels.CartLineModel): void {
        }

        protected addLineFailed(error: any): void {
        }

        reorderAllProducts($event): void {
            $event.preventDefault();
            this.canReorderItems = false;
            const cartLines = this.orderService.convertToCartLines(this.order.orderLines);
            if (cartLines.length > 0) {
                this.cartService.addLineCollection(cartLines, true).then(
                    (cartLineCollection: CartLineCollectionModel) => { this.addLineCollectionCompleted(cartLineCollection); },
                    (error: any) => { this.addLineCollectionFailed(error); });
            }
        }

        protected addLineCollectionCompleted(cartLineCollection: Insite.Cart.WebApi.V1.ApiModels.CartLineCollectionModel): void {
        }

        protected addLineCollectionFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfOrderTrackerOrderDetailController", nbf.OrderTracker.NbfOrderTrackerOrderDetailController);
}