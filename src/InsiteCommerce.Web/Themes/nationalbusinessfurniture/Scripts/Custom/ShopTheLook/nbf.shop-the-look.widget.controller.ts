module nbf.ShopTheLook {
    "use strict";

    export class NbfShopTheLookWidgetController {
        look: ShopTheLook;
        favoritesWishlist: WishListModel;

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "productService", "sessionService", "nbfShopTheLookService", "queryString", "spinnerService", "nbfWishListService"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected productService: insite.catalog.IProductService,
            protected sessionService: insite.account.ISessionService,
            protected nbfShopTheLookService: INbfShopTheLookService,
            protected queryString: insite.common.IQueryStringService,
            protected spinnerService: insite.core.SpinnerService,
            protected nbfWishListService: insite.wishlist.INbfWishListService) {
            this.init();
        }

        init(): void {
            this.spinnerService.show("mainLayout", true);
            var id = this.queryString.get("lookId");
            this.nbfShopTheLookService.getLook(id).then(
                (look: ShopTheLook) => { this.getLookCompleted(look); },
                (error: any) => { this.getLookFailed(error); });
        }

        protected getLookCompleted(look: ShopTheLook): void {
            this.look = look;
            this.spinnerService.hide("mainLayout");
        }

        protected getLookFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            this.spinnerService.hide("mainLayout");
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

        //protected toggleFavorite(product: ProductDto) {
        //    var favoriteLine = this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id);

        //    if (favoriteLine.length > 0) {
        //        //Remove lines
        //        this.nbfWishListService.deleteLineCollection(this.favoritesWishlist, favoriteLine).then(() => {
        //            this.getFavorites();
        //        });
        //    } else {
        //        //Add Lines
        //        var addLines = [product];
        //        this.nbfWishListService.addWishListLines(this.favoritesWishlist, addLines).then(() => {
        //            this.getFavorites();
        //        });
        //        this.$rootScope.$broadcast("initAnalyticsEvent", "AddProductToWIshList");
        //    }
        //}

        //protected getFavorites() {
        //    this.nbfWishListService.getWishLists("CreatedOn", "wishlistlines").then((wishList) => {
        //        this.favoritesWishlist = wishList.wishListCollection[0];

        //        this.look.productHotSpots.forEach(hotSpot => {
        //            hotSpot.product.product.properties["isFavorite"] = "false";
        //            if (this.favoritesWishlist) {
        //                if (this.favoritesWishlist.wishListLineCollection) {
        //                    if (this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id)[0]) {
        //                        product.properties["isFavorite"] = "true";
        //                    }
        //                } else {
        //                    this.favoritesWishlist.wishListLineCollection = [];
        //                }
        //            } else {
        //                this.favoritesWishlist = {
        //                    wishListLineCollection: [] as WishListLineModel[]
        //                } as WishListModel;
        //            }
        //        });
        //    });
        //}
    }
    angular
        .module("insite")
        .filter("validateHotSpots", () => hotSpots => {
            var validHotSpots = [];
            angular.forEach(hotSpots,
                hotSpot => {
                    if (hotSpot["hotSpotPosition"] !== "NA") {
                        validHotSpots.push(hotSpot);
                    }
                });
            return validHotSpots;
        })
        .controller("NbfShopTheLookWidgetController", NbfShopTheLookWidgetController);
}