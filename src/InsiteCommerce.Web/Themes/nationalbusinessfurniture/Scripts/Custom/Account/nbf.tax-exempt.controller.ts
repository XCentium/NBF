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
        }

        protected onCartLoaded(event: ng.IAngularEvent, cart: CartModel): void {
            this.cart = cart;

            if (this.cart.billTo && this.cart.billTo.properties["taxExemptFileName"]) {
                this.isTaxExempt = true;
                this.taxExemptFileName = this.cart.billTo.properties["taxExemptFileName"];
            }
        }

        upload() {
            $('#contactUsFormFile').bind('change', function () {
                if (this.files[0].size > 2500000) {
                    $("#contactUsFormFile").val("");
                    $("#fileError").removeClass("field-validation-valid").addClass("field-validation-error").html("<span id='fileSizeError'>Please upload a file that is less than 2.5MB</span>");
                } else {
                    $("#fileSizeError").hide();
                    $("#fileError").removeClass("field-validation-error");
                }
            });
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

        uploadFile(event) {
            let files = event.target.files;
            if (files.length > 0) {
                console.log(files); // You will see the file
                let formData: FormData = new FormData();
            }
        }

        openUpload() {
            $("#hiddenFileUpload").click();
        }

        checkFile() {
            this.file = $("#hiddenFileUpload").prop('files')[0];
            if (this.file) {
                this.taxExemptFileName = this.file.name;
            }
        }
    }


    angular
        .module("insite")
        .controller("TaxExemptController", TaxExemptController);
}