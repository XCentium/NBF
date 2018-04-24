module nbf.ShopTheLook {
    "use strict";

    export class NbfShopTheLookWidgetController {
        look: ShopTheLook;

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "productService", "sessionService", "nbfShopTheLookService", "queryString"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected productService: insite.catalog.IProductService,
            protected sessionService: insite.account.ISessionService,
            protected nbfShopTheLookService: INbfShopTheLookService,
            protected queryString: insite.common.IQueryStringService) {
            this.init();
        }

        init(): void {
            var id = this.queryString.get("lookId");
            this.nbfShopTheLookService.getLook(id).then(
                (look: ShopTheLook) => { this.getLookCompleted(look); },
                (error: any) => { this.getLookFailed(error); });
        }

        protected getLookCompleted(look: ShopTheLook): void {
            this.look = look;
        }

        protected getLookFailed(error: ng.IHttpPromiseCallbackArg<any>): void {

        }

        protected hotspot_clicked(hotspotId: string, index: number): void {
            let p = $("#" + hotspotId + "-" + (index + 1));

            var windowsize = $(window).width();
            if (windowsize > 1220) {
                if (p.hasClass("open")) {
                    p.removeClass("open");
                } else {
                    $(".hotspot").removeClass("open");
                    p.addClass("open");
                }
            }
            else {
                this.$window.location.href = p.find("a.btn").attr("href");
            }
        }
    }
    angular
        .module("insite")
        .controller("NbfShopTheLookWidgetController", NbfShopTheLookWidgetController);
}