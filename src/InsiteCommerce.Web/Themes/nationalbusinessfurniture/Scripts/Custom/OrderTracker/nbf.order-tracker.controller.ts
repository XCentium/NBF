module nbf.OrderTracker {
    "use strict";

    export class NbfOrderTrackerController {
        orderNumber: string;
        phoneNumber: string;
        submitted = false;
        $form: JQuery;
        orderNotFound: boolean = false;
        order: OrderModel;

        static $inject = ["$element", "$scope", "nbfOrderTrackerService", "$window"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected nbfOrderTrackerService: nbf.OrderTracker.IOrderTrackerService,
            protected $window: ng.IWindowService) {
            this.init();
        }

        init(): void {
            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);
        }

        submit($event, orderDetailUrl: string): boolean {
            $event.preventDefault();
            if (!this.$form.valid()) {
                return false;
            }

            this.getOrder(this.orderNumber, this.phoneNumber, orderDetailUrl);

            return false;
        }

        getOrder(orderNumber: string, phoneNumber: string, orderDetailUrl: string): void {
            this.nbfOrderTrackerService.getOrder(orderNumber, phoneNumber).then(
                (order: OrderModel) => { this.getOrderCompleted(order, orderDetailUrl); },
                (error: any) => { this.getOrderFailed(error); });
        }

        protected getOrderCompleted(order: OrderModel, orderDetailUrl: string): void {
            this.order = order;
        }

        protected getOrderFailed(error: any): void {
            this.orderNotFound = true;
        }
    }

    angular
        .module("insite")
        .controller("NbfOrderTrackerController", NbfOrderTrackerController);
}