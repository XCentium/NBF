﻿module insite.order {
    "use strict";

    export class OrderDetailController {
        order: OrderModel;
        orderNumber: string;
        canReorderItems = false;
        btFormat: string;
        stFormat: string;
        validationMessage: string;
        showCancelationConfirmation = false;
        showInventoryAvailability = false;
        requiresRealTimeInventory = false;
        failedToGetRealTimeInventory = false;
        showPoNumber: boolean;
        showTermsCode: boolean;
        showOrderStatus: boolean;
        promotions: PromotionModel[];
        allowCancellationStatuses: string[];
        allowRmaStatuses: string[];

        static $inject = ["orderService", "settingsService", "queryString", "coreService", "sessionService", "cartService"];

        constructor(
            protected orderService: order.IOrderService,
            protected settingsService: core.ISettingsService,
            protected queryString: common.IQueryStringService,
            protected coreService: core.ICoreService,
            protected sessionService: account.ISessionService,
            protected cartService: cart.ICartService) {
            this.init();
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.orderNumber = this.queryString.get("orderNumber");
            if (typeof this.orderNumber === "undefined") {
                // handle "clean urls"
                const pathArray = window.location.pathname.split("/");
                const pathOrderNumber = pathArray[pathArray.length - 1];
                if (pathOrderNumber !== "OrderHistoryDetail") {
                    this.orderNumber = pathOrderNumber;
                }
            }

            this.getOrder(this.orderNumber);
            this.getOrderStatusMappings();
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.canReorderItems = settingsCollection.orderSettings.canReorderItems;
            this.showInventoryAvailability = settingsCollection.productSettings.showInventoryAvailability;
            this.showPoNumber = settingsCollection.orderSettings.showPoNumber;
            this.showTermsCode = settingsCollection.orderSettings.showTermsCode;
            this.showOrderStatus = settingsCollection.orderSettings.showOrderStatus;
            this.requiresRealTimeInventory = settingsCollection.productSettings.realTimeInventory;
        }

        protected getSettingsFailed(error: any): void {
        }

        getOrderStatusMappings(): void {
            this.orderService.getOrderStatusMappings().then(
                (orderStatusMappingCollection: OrderStatusMappingCollectionModel) => { this.getOrderStatusMappingsCompleted(orderStatusMappingCollection); },
                (error: any) => { this.getOrderStatusMappingsFailed(error); });
        }

        protected getOrderStatusMappingsCompleted(orderStatusMappingCollection: OrderStatusMappingCollectionModel): void {
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

        discountOrderFilter(promotion: PromotionModel): boolean {
            if (promotion == null) {
                return false;
            }

            return (promotion.promotionResultType === "AmountOffOrder" || promotion.promotionResultType === "PercentOffOrder");
        }

        discountShippingFilter(promotion: PromotionModel): boolean {
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

        getOrder(orderNumber: string): void {
            this.orderService.getOrder(orderNumber, "orderlines,shipments").then(
                (order: OrderModel) => { this.getOrderCompleted(order); },
                (error: any) => { this.getOrderFailed(error); });
        }

        protected getOrderCompleted(order: OrderModel): void {
            this.order = order;
            this.btFormat = this.formatCityCommaStateZip(this.order.billToCity, this.order.billToState, this.order.billToPostalCode);
            this.stFormat = this.formatCityCommaStateZip(this.order.shipToCity, this.order.shipToState, this.order.shipToPostalCode);
            this.getRealTimeInventory();
        }

        protected getOrderFailed(error: any): void {
            this.validationMessage = error.exceptionMessage;
        }

        reorderProduct($event, line: OrderLineModel): void {
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

        protected addLineCompleted(cartLine: CartLineModel): void {
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

        protected addLineCollectionCompleted(cartLineCollection: CartLineCollectionModel): void {
        }

        protected addLineCollectionFailed(error: any): void {
        }

        cancelAndReorder($event): void {
            this.reorderAllProducts($event);
            this.cancelOrder($event);
        }

        cancelOrder($event): void {
            // call update order with cancelation status
            const updateOrderModel = ({ status: "CancellationRequested" } as any) as OrderModel;
            updateOrderModel.erpOrderNumber = this.orderNumber;

            this.orderService.updateOrder(this.orderNumber, updateOrderModel).then(
                (order: OrderModel) => { this.updateOrderCompleted(order); },
                (error: any) => { this.updateOrderFailed(error); });
        }

        protected updateOrderCompleted(order: OrderModel): void {
            this.order.status = order.status;
            this.order.statusDisplay = order.statusDisplay;
            this.showCancelationConfirmation = true;
        }

        protected updateOrderFailed(error: any): void {
            this.validationMessage = error.exceptionMessage;
        }

        showShareModal(entityId: string): void {
            this.coreService.displayModal(`#shareEntityPopupContainer_${entityId}`);
        }

        getRealTimeInventory(): void {
            if (this.requiresRealTimeInventory) {
                this.cartService.getRealTimeInventory({ cartLines: this.order.orderLines as any as CartLineModel[] } as CartModel).then(
                    (realTimeInventory: RealTimeInventoryModel) => this.getRealTimeInventoryCompleted(realTimeInventory),
                    (error: any) => this.getRealTimeInventoryFailed(error));
            }
        }

        protected getRealTimeInventoryCompleted(realTimeInventory: RealTimeInventoryModel): void {
        }

        protected getRealTimeInventoryFailed(error: any): void {
            this.failedToGetRealTimeInventory = true;
        }
    }

    angular
        .module("insite")
        .controller("OrderDetailController", OrderDetailController);
}