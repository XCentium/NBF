module nbf.Checkout {
    "use strict";

    export class NbfShopTheLookController {

        init(): void {

            ($(document) as any).foundation({
                accordion: {
                    // specify the class used for accordion panels
                    content_class: "content",
                    // specify the class used for active (or open) accordion panels
                    active_class: "active",
                    // allow multiple accordion panels to be active at the same time
                    multi_expand: true,
                    // allow accordion panels to be closed by clicking on their headers
                    // setting to false only closes accordion panels when another is opened
                    toggleable: false
                }
            });

            $(".accordion-navigation a").click(e => {
                if (e.target.id.indexOf(this.step.toString()) === -1) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $("#addressForm").change(() => {
                if (this.billToSameAsShipToSelected) {
                    this.updateBillTo();
                }
            });

            $(".masked-phone").mask("999-999-9999", { autoclear: false });
        }

       
        
    }

    angular
        .module("insite")
        .controller("NbfCheckoutController", NbfShopTheLookController);
}