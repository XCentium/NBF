module insite.account {
    import BaseUploadController = common.BaseUploadController;
    "use strict";

    export class TaxExemptController {
        cart: CartModel;
        isTaxExempt = false;
        taxExemptChoice = true;
        taxExemptFileName: string;
        file: any = null;

        static $inject = [
            "$scope",
            "productService",
            "coreService",
            "$window",
            "accountService",
            "sessionService",
            "customerService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected productService: catalog.IProductService,
            protected coreService: core.ICoreService,
            protected $window: ng.IWindowService,
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected customerService: customers.ICustomerService) {
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
            this.cart = cart;

            if (this.cart.billTo && this.cart.billTo.properties["taxExemptFileName"]) {
                this.isTaxExempt = true;
                this.taxExemptFileName = this.cart.billTo.properties["taxExemptFileName"];
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
    }


    angular
        .module("insite")
        .controller("TaxExemptController", TaxExemptController);
}