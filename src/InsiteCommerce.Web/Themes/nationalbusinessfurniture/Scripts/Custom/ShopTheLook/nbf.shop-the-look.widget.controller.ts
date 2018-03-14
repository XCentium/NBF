module nbf.shopthelook {
    import IProductService = insite.catalog.IProductService;
    import Account = insite.account;

    "use strict";

    export interface INbfShopTheLookWidgetControllerAttributes extends ng.IAttributes {
        productIdString: string;
    }

    export interface ProductHotSpot {
        product: ProductModel;
        hotSpotPosition:string;
    }

    export class NbfShopTheLookWidgetController {
        productHotSpots: ProductHotSpot[];

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "$attrs", "productService", "sessionService"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected $attrs: INbfShopTheLookWidgetControllerAttributes,
            protected productService: IProductService,
            protected sessionService: Account.ISessionService) {
            this.init();
        }

        init(): void {
            var productGroups = [];
            if (this.$attrs.productIdString) {
                productGroups = this.$attrs.productIdString.split("||");
            }
            var hotSpots = [];
            const expand = ["pricing", "attributes"];
            productGroups.forEach(group => {
                var hotSpot = {} as ProductHotSpot;
                if (group) {
                    
                }
                this.productService.getProduct(null, group.split(";")[0], expand).then(
                    (x: any) => {
                        if (x && x.product) {
                            hotSpot.product = x.product;
                            hotSpot.hotSpotPosition = group.split(";")[1] + ";" + group.split(";")[2];
                            hotSpots.push(hotSpot);
                        }
                    },
                    (error: any) => {
                        console.error(error);
                    });
            });

            this.productHotSpots = hotSpots;
        }

        protected hotspot_clicked(hotspotId: string): void {
            let p = $("#" + hotspotId);

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