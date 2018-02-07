module nbf.OrderTracker {
    "use strict";

    export class NbfOrderTrackerController {
        orderNumber: string;
        phoneNumber: string;
        submitted = false;
        $form: JQuery;
        orderNotFound: boolean = false;
        orderId: string;

        static $inject = ["$element", "$scope", "nbfOrderTrackerService", "$window", "spinnerService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected nbfOrderTrackerService: OrderTracker.INbfOrderTrackerService,
            protected $window: ng.IWindowService,
            protected spinnerService: insite.core.SpinnerService) {
            this.init();
        }

        init(): void {
            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);

            $(".masked-phone").mask("999-999-9999", { autoclear: false });
        }

        submit($event, orderDetailUrl: string): boolean {
            $event.preventDefault();
            if (!this.$form.valid()) {
                return false;
            }

            this.getOrderId(this.orderNumber, this.phoneNumber, orderDetailUrl);

            return false;
        }

        getOrderId(orderNumber: string, phoneNumber: string, orderDetailUrl: string): void {
            this.spinnerService.show("mainLayout", true);

            this.nbfOrderTrackerService.getOrderId(orderNumber, phoneNumber).then(
                (orderId: string) => { this.getOrderIdCompleted(orderId, orderDetailUrl); },
                (error: any) => { this.getOrderIdFailed(error); });
        }

        protected getOrderIdCompleted(orderId: string, orderDetailUrl: string): void {
            if (orderId != null) {
                this.orderId = orderId;
                this.$window.location.href = "/OrderTracker/Order?orderId=" + this.orderId;
            } else {
                this.getOrderIdFailed();
            }
        }

        protected getOrderIdFailed(error?: any): void {
            this.orderNotFound = true;

            this.spinnerService.hide("mainLayout");
        }
    }

    angular
        .module("insite")
        .controller("NbfOrderTrackerController", NbfOrderTrackerController);
}