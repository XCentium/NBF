module insite.account {
    "use strict";

    export interface TaxExemptParams {
        customerNumber: string;
        customerSequence: string;
        orderNumber?: string;
        emailTo: string;
        fileName: string;
        fileData: string;
    }

    export class TaxExemptController {
        cart: CartModel;
        isTaxExempt = false;
        taxExemptChoice = false;
        taxExemptFileName: string;
        file: any;
        fileData: any = {};
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
            "nbfTaxExemptService",
            "spinnerService"
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
            protected nbfTaxExemptService: INbfTaxExemptService,
            protected spinnerService: core.ISpinnerService) {
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
            document.getElementById("taxExemptFileUpload").onchange = function () {
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
                } else {
                    this.isTaxExempt = false;
                    this.taxExemptChoice = false;
                    this.success = false;
                    this.saved = false;
                    this.taxExemptFileName = "";
                    $("taxExemptFileUpload").val("");
                }
            }
            this.spinnerService.hide("mainLayout");
        }

        setFile(arg): boolean {
            this.errorMessage = "";

            if (!this.$form.valid()) {
                return false;
            }

            if (arg.files.length > 0) {
                this.file = arg.files[0];
                this.taxExemptFileName = this.file.name;

                let r = new FileReader();

                r.addEventListener("load", () => {
                    this.fileData.b64 = r.result.split(",")[1];
                    this.$scope.$apply();
                }, false);


                r.readAsDataURL(this.file); //once defined all callbacks, begin reading the file               

                setTimeout(() => {
                    this.$scope.$apply();
                });
            }
        }

        openUpload() {
            if (!this.isTaxExempt && !this.saved) {
                $("#taxExemptFileUpload").click();
            }
        }

        setNoTaxExempt($event) {
            if ((this.isTaxExempt && this.saved) || (this.isTaxExempt && this.taxExemptFileName)) {
                this.taxExemptChoice = true;
                this.coreService.displayModal("#popup-delete-tax-exempt-confirmation");
            }
        }

        closeModal(selector: string): void {
            this.coreService.closeModal(selector);
        }

        protected addTaxExempt() {
            this.cart.billTo.properties["taxExemptFileName"] = this.taxExemptFileName;

            this.nbfTaxExemptService.addTaxExempt(this.cart.billTo.id).then(() => 
            {
                this.customerService.updateBillTo(this.cart.billTo).then(
                    () => {
                        this.success = true;
                        setTimeout(() => {
                            this.success = false;
                        }, 4000);
                        this.saved = true;
                        this.isTaxExempt = true;
                        this.spinnerService.hide("mainLayout");
                    },
                    (error: any) => { this.updateBillToFailed(error); });
            },() => {
                this.spinnerService.hide("mainLayout");
            });
        }

        removeTaxExempt() {
            this.spinnerService.show("mainLayout", true);
            this.taxExemptChoice = false;
            this.coreService.closeModal("#popup-delete-tax-exempt-confirmation");

            this.nbfTaxExemptService.removeTaxExempt(this.cart.billTo.id).then(() => {
                delete this.cart.billTo.properties["taxExemptFileName"];
                this.customerService.updateBillTo(this.cart.billTo).then(
                    () => { this.cartService.getCart().then((confirmedCart: CartModel) => {
                        this.onCartLoaded(confirmedCart);
                    }); },
                    (error: any) => {
                        this.updateBillToFailed(error);
                    });
            }, () => {
                this.spinnerService.hide("mainLayout");
            });
        }

        saveFile(emailTo: string, orderNum?: string) {
            this.spinnerService.show("mainLayout", true);
            var params = {
                customerNumber: this.cart.billTo.customerNumber,
                customerSequence: this.cart.billTo.customerSequence,
                emailTo: emailTo,
                orderNumber: orderNum,
                fileName: this.taxExemptFileName,
                fileData: this.fileData.b64
            } as TaxExemptParams;

            this.nbfEmailService.sendTaxExemptEmail(params).then(() => {
                this.addTaxExempt();
            }, () => {
                this.errorMessage = "An error has occurred.";
                this.spinnerService.hide("mainLayout"); });
        }

        protected updateBillToFailed(error: any): void {
            this.errorMessage = "An error has occurred.";
            this.spinnerService.hide("mainLayout");
        }
    }
    
    angular
        .module("insite")
        .controller("TaxExemptController", TaxExemptController);
}