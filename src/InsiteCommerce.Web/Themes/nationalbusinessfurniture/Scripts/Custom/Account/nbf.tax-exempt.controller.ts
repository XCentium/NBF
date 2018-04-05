module insite.account {
    "use strict";

    export interface TaxExemptParams {
        customerNumber: string;
        customerSequence: string;
        orderNumber?: string;
        emailTo: string;
        file: any[];
    }

    export class TaxExemptController {
        customerNumber: string;
        customerSequence: string;
        emailTo: string;
        isTaxExempt = false;
        taxExemptChoice = true;
        taxExemptFileName: string;
        file: any;
        errorMessage: string;
        success: boolean = false;

        static $inject = [
            "$scope",
            "productService",
            "coreService",
            "$window",
            "accountService",
            "sessionService",
            "customerService",
            "nbfEmailService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected productService: catalog.IProductService,
            protected coreService: core.ICoreService,
            protected $window: ng.IWindowService,
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected customerService: customers.ICustomerService,
            protected nbfEmailService: nbf.email.INbfEmailService) {
            this.init();
        }

        init(): void {
            this.$scope.$on("cartLoaded", (event: ng.IAngularEvent, cart: CartModel) => this.onCartLoaded(event, cart));

            var self = this;
            document.getElementById('taxExemptFileUpload').onchange = function () {
                self.setFile(this);
            };
        }

        protected onCartLoaded(event: ng.IAngularEvent, cart: CartModel): void {
            if (cart.billTo) {
                this.customerNumber = cart.billTo.customerNumber;
                this.customerSequence = cart.billTo.customerSequence;

                if (cart.billTo.properties["taxExemptFileName"]) {
                    this.isTaxExempt = true;
                    this.taxExemptFileName = cart.billTo.properties["taxExemptFileName"];
                }   
            }
        }

        setFile(arg): void {
            if (arg.files.length > 0) {
                this.file = arg.files[0];
                this.taxExemptFileName = this.file.name;

                setTimeout(() => {
                    this.$scope.$apply();
                });
            }
        }

        openUpload() {
            setTimeout(() => {
                $("#taxExemptFileUpload").click();
            },100);
        }

        saveFile(orderNum?: string) {
            var fileReader = new FileReader();
            if (this.file) {
                fileReader.readAsArrayBuffer(this.file);
                fileReader.onload = () => {
                    var params = {
                        customerNumber: this.customerNumber,
                        customerSequence: this.customerSequence,
                        emailTo: this.emailTo,
                        orderNumber: orderNum,
                        file: fileReader.result
                    } as TaxExemptParams;

                    this.nbfEmailService.sendTaxExemptEmail(params).then(
                        () => { this.success = true; },
                        () => { this.errorMessage = "An error has occurred."; });
                };
            }
        }
    }


    angular
        .module("insite")
        .controller("TaxExemptController", TaxExemptController);
}