module nbf.ShopTheLookDetails {
    "use strict";
    export class NbfShopTheLookWidgetController {
        static $inject = ["$window"];
        constructor(protected $window: ng.IWindowService) {
            this.init();
        }
        init(): void {
            //var self = this;
            //$('.hotspot').on('click', function (e) {
            //    alert("I am here");
            //    e.preventDefault();
            //    var p = $(this);
            //    var windowsize = $(window).width();
            //    if (windowsize > 1220) {
            //        if (p.hasClass('open')) {
            //            p.removeClass('open');
            //        } else {
            //            $('.hotspot').removeClass('open');
            //            p.addClass('open');
            //        }
            //    }
            //    else {
            //        self.$window.location.href = p.find('a.btn').attr("href");
            //        return false;
            //    }
            //});
        }

        protected hotspot_clicked(hotspotId: string): void {
            let p = $("#" + hotspotId);

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
                this.$window.location.href = p.find('a.btn').attr("href");
            }
        }
    }
    angular
        .module("insite")
        .controller("NbfShopTheLookWidgetController", NbfShopTheLookWidgetController);
}