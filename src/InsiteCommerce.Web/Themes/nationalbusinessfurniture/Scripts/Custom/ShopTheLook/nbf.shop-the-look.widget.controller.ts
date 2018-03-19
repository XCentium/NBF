module nbf.shopthelook {
    import IProductService = insite.catalog.IProductService;
    import Account = insite.account;
    import IProductCollectionParameters = insite.catalog.IProductCollectionParameters;

    "use strict";

    export interface INbfShopTheLookWidgetControllerAttributes extends ng.IAttributes {
        productString: string;
    }

    export interface ProductHotSpot {
        productErp: string;
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
            var hotSpots = [];
            if (this.$attrs.productString) {
                this.$attrs.productString.split("||").forEach(group => {
                    var split = group.split(";");
                    hotSpots.push({
                        productErp: split[0],
                        hotSpotPosition: split[1] + ";" + split[2]
                    } as ProductHotSpot);
                });
            }

            const expand = ["pricing", "attributes"];
            var params = {
                erpNumbers: hotSpots.map(a => a.productErp)
            } as IProductCollectionParameters;
            
            this.productService.getProducts(params, expand).then(
                (result) => {
                    hotSpots.forEach(hotSpot => {
                        hotSpot.product = result.products.filter(x => x.erpNumber === hotSpot.productErp)[0];
                    });
                }
            );

            this.productHotSpots = hotSpots;
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