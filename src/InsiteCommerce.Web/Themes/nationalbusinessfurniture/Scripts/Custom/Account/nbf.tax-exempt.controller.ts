module insite.account {
    "use strict";

    export interface TaxExemptParams {
        customerNumber: string;
        customerSequence: string;
        orderNumber?: string;
        emailTo: string;
        fileLocation: string;
    }

    export class TaxExemptController {
        cart: CartModel;
        isTaxExempt = false;
        taxExemptChoice = false;
        taxExemptFileName: string;
        file: any;
        errorMessage: string;
        success = false;
        saved = false;
        $form: JQuery;

        static $inject = [
            "$scope",
            "productService",
            "coreService",
            "$window",
            "accountService",
            "sessionService",
            "customerService",
            "nbfEmailService",
            "$element",
            "cartService",
            "nbfTaxExemptService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected productService: catalog.IProductService,
            protected coreService: core.ICoreService,
            protected $window: ng.IWindowService,
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected customerService: customers.ICustomerService,
            protected nbfEmailService: nbf.email.INbfEmailService,
            protected $element: ng.IRootElementService,
            protected cartService: cart.ICartService,
            protected nbfTaxExemptService: INbfTaxExemptService) {
            this.init();
        }

        init(): void {
            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);

            this.cartService.getCart().then(
                (confirmedCart: CartModel) => { this.onCartLoaded(confirmedCart); });

            var self = this;
            document.getElementById('taxExemptFileUpload').onchange = function () {
                self.setFile(this);
            };
        }

        protected onCartLoaded(cart: CartModel): void {
            this.cart = cart;
            if (this.cart.billTo) {
                if (this.cart.billTo.properties["taxExemptFileName"]) {
                    this.isTaxExempt = true;
                    this.taxExemptChoice = true;
                    this.taxExemptFileName = this.cart.billTo.properties["taxExemptFileName"];
                }
            }
        }

        setFile(arg): boolean {
            this.errorMessage = "";

            if (!this.$form.valid()) {
                return false;
            }

            if (arg.files.length > 0) {
                this.file = arg.files[0];
                this.taxExemptFileName = this.file.name;

                setTimeout(() => {
                    this.$scope.$apply();
                });
            }
        }

        openUpload() {
            if (!this.isTaxExempt && !this.saved) {
                setTimeout(() => {
                    $("#taxExemptFileUpload").click();
                }, 100);
            }
        }

        saveFile(emailTo: string, orderNum?: string) {
            var params = {
                customerNumber: this.cart.billTo.customerNumber,
                customerSequence: this.cart.billTo.customerSequence,
                emailTo: emailTo,
                orderNumber: orderNum,
                fileLocation: ""
            } as TaxExemptParams;

            this.nbfEmailService.sendTaxExemptEmail(params, this.file).then(
                () => {
                    this.updateBillTo();
                },
                () => { this.errorMessage = "An error has occurred."; });
        }

        protected updateBillTo() {
            this.cart.billTo.properties["taxExemptFileName"] = this.taxExemptFileName;

            this.nbfTaxExemptService.updateBillto(this.cart.billTo.id);

            this.customerService.updateBillTo(this.cart.billTo).then(
                () => { this.updateBillToCompleted(); },
                (error: any) => { this.updateBillToFailed(error); });
        }

        protected updateBillToCompleted(): void {
            this.success = true;
            this.saved = true;
        }

        protected updateBillToFailed(error: any): void {
            this.errorMessage = "An error has occurred.";
        }
    }


    angular
        .module("insite")
        .controller("TaxExemptController", TaxExemptController);
}