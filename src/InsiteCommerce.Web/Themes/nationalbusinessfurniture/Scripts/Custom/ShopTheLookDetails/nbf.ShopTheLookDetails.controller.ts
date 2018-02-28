module nbf.ShopTheLookDetails {
    "use strict";

    export class NbfShopTheLookDetailsController {


        constructor(
        ) {
            this.init();
        }

        init(): void {

            $('.hotspot').on('click', function (e) {
                e.preventDefault();
                var p = $(this);
                if (p.hasClass('open')) {
                    p.removeClass('open');
                } else {
                    $('.hotspot').removeClass('open');
                    p.addClass('open');
                }
            });

           
        }

       
        
    }

    angular
        .module("insite")
        .controller("NbfShopTheLookDetailsController", NbfShopTheLookDetailsController);
}