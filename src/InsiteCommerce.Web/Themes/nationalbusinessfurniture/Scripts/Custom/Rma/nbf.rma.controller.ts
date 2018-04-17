module insite.rma {
    "use strict";

    import RmaLineDto = Insite.Order.Services.Dtos.RmaLineDto;

    export class NbfRmaController {
        orderLinesForm: any;
        totalQuantity = 0;
        requestSubmitted = false;
        cityCommaStateZipDisplay: string;
        resultMessage: string;
        errorMessage: string;
        returnNotes: string;
        order: OrderModel;
        file: any;
        rmaPictureFileName: string;
        $form: JQuery;

        static $inject = ["$scope", "orderService", "coreService", "queryString", "nbfEmailService"];

        constructor(
            protected $scope: ng.IScope,
            protected orderService: order.IOrderService,
            protected coreService: core.ICoreService,
            protected queryString: common.IQueryStringService,
            protected nbfEmailService: nbf.email.INbfEmailService
            ) {
            this.init();
        }

        init(): void {
            this.getOrder();

            var self = this;
            document.getElementById('rmaPictureFileUpload').onchange = function () {
                self.setFile(this);
            };
        }

        setFile(arg): boolean {
            this.errorMessage = "";

            if (!this.$form.valid()) {
                return false;
            }

            if (arg.files.length > 0) {
                this.file = arg.files[0];
                this.rmaPictureFileName = this.file.name;

                setTimeout(() => {
                    this.$scope.$apply();
                });
            }
        }        

        getOrder(): void {
            this.orderService.getOrder(this.getOrderNumber(), "orderlines").then(
                (order: OrderModel) => { this.getOrderCompleted(order); },
                (error: any) => { this.getOrderFailed(error); });
        }

        protected getOrderNumber(): string {
            let orderNumber = this.queryString.get("orderNumber");
            if (typeof orderNumber === "undefined") {
                const pathArray = window.location.pathname.split("/");
                const pathNumber = pathArray[pathArray.length - 1];
                if (pathNumber !== "OrderHistoryDetail") {
                    orderNumber = pathNumber;
                }
            }

            return orderNumber;
        }

        protected getOrderCompleted(order: OrderModel): void {
            this.order = order;
            this.cityCommaStateZipDisplay = this.formatCityCommaStateZip(order.billToCity, order.billToState, order.billToPostalCode);
        }

        protected getOrderFailed(error: any): void {
        }

        protected formatCityCommaStateZip(city: string, state: string, zip: string): string {
            let formattedString = "";
            if (city) {
                formattedString = city;
                if (state) {
                    formattedString += `, ${state} ${zip}`;
                }
            }

            return formattedString;
        }

        sendRmaRequest(): void {
            this.errorMessage = "";
            this.requestSubmitted = false;
            this.orderLinesForm.$submitted = true;

            if (!this.orderLinesForm.$valid) {
                return;
            }

            const rmaModel = {
                orderNumber: this.order.webOrderNumber || this.order.erpOrderNumber,
                notes: typeof this.returnNotes === "undefined" ? "" : this.returnNotes,
                message: "",
                rmaLines: this.order.orderLines.map(orderLine => {
                    return {
                        line: orderLine.lineNumber,
                        rmaQtyRequested: orderLine.rmaQtyRequested,
                        rmaReasonCode: orderLine.returnReason
                    } as RmaLineDto;
                }).filter(x => x.rmaQtyRequested > 0)
            } as RmaModel;

            this.orderService.addRma(rmaModel).then(
                (rma: RmaModel) => { this.addRmaCompleted(rma); },
                (error: any) => { this.addRmaFailed(error); });
        }

        protected addRmaCompleted(rma: RmaModel): void {
            if (rma.message) {
                this.resultMessage = rma.message;
            } else {
                this.requestSubmitted = true;
                this.orderLinesForm.$submitted = false;
            }

            this.nbfEmailService.sendRmaEmail(rma, this.file).then(
                () => {
                    //this.updateBillTo();
                },
                () => { this.errorMessage = "An error has occurred."; });

            this.coreService.displayModal(angular.element("#popup-rma"));
        }

        protected addRmaFailed(error: any): void {
            this.errorMessage = error.message;
        }

        closePopup($event): void {
            $event.preventDefault();
            this.coreService.closeModal("#popup-rma");
        }

        calculateQuantity(): void {
            this.totalQuantity = 0;
            this.order.orderLines.forEach(orderLine => {
                this.totalQuantity += orderLine.rmaQtyRequested > 0 ? 1 : 0;
            });
        }
    }

    angular
        .module("insite")
        .controller("NbfRmaController", NbfRmaController);
}