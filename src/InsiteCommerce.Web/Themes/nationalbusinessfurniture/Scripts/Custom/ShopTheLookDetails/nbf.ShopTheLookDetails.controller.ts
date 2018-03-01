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
                var windowsize = $(window).width();
                if (windowsize > 1220) {
                    if (p.hasClass('open')) {
                        p.removeClass('open');
                    } else {
                        $('.hotspot').removeClass('open');
                        p.addClass('open');
                    }
                }
                else {
                    window.location = p.find('a.btn').attr("href");
                    return false;
                }
            });

           
        }

       
        
    }

    angular
        .module("insite")
        .controller("NbfShopTheLookDetailsController", NbfShopTheLookDetailsController);
}