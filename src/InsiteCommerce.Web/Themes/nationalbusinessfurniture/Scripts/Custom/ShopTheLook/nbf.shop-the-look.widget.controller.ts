﻿module nbf.ShopTheLook {
    "use strict";

    export interface INbfShopTheLookWidgetControllerAttributes extends ng.IAttributes {
        prApiKey: string;
        prMerchantGroupId: string;
        prMerchantId: string;
    }

    export class NbfShopTheLookWidgetController {
        look: ShopTheLook;
        favoritesWishlist: WishListModel;
        isAuthenticated: boolean = false;
        imagesLoaded: number;

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "productService", "sessionService", "nbfShopTheLookService", "queryString", "spinnerService", "nbfWishListService", "$attrs"];

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
            protected nbfWishListService: insite.wishlist.INbfWishListService,
            protected $attrs: INbfShopTheLookWidgetControllerAttributes) {
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

            this.sessionService.getIsAuthenticated().then(authenticated => {
                this.isAuthenticated = authenticated;
                if (authenticated) {
                    this.getFavorites();
                }
            });

            this.imagesLoaded = 0;
            this.waitForDom();
            
            setTimeout(() => {
                this.setPowerReviews();
            }, 100);

            this.spinnerService.hide("mainLayout");
        }

        protected getLookFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            this.spinnerService.hide("mainLayout");
        }

        protected hotspotClicked(hotspotId: string, index: number): void {
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

        protected toggleFavorite(product: ProductDto) {
            var favoriteLine = this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id);

            if (favoriteLine.length > 0) {
                //Remove lines
                this.nbfWishListService.deleteLineCollection(this.favoritesWishlist, favoriteLine).then(() => {
                    this.getFavorites();
                });
            } else {
                //Add Lines
                var addLines = [product];
                this.nbfWishListService.addWishListLines(this.favoritesWishlist, addLines).then(() => {
                    this.getFavorites();
                });
                this.$rootScope.$broadcast("initAnalyticsEvent", "AddProductToWIshList");
            }
        }

        protected getFavorites() {
            this.nbfWishListService.getWishLists("CreatedOn", "wishlistlines").then((wishList) => {
                this.favoritesWishlist = wishList.wishListCollection[0];

                this.look.productHotSpots.forEach(hotSpot => {
                    hotSpot.product.properties["isFavorite"] = "false";
                    if (this.favoritesWishlist) {
                        if (this.favoritesWishlist.wishListLineCollection) {
                            if (this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === hotSpot.product.id)[0]) {
                                hotSpot.product.properties["isFavorite"] = "true";
                            }
                        } else {
                            this.favoritesWishlist.wishListLineCollection = [];
                        }
                    } else {
                        this.favoritesWishlist = {
                            wishListLineCollection: [] as WishListLineModel[]
                        } as WishListModel;
                    }
                });
            });
        }

        protected setPowerReviews() {
            let powerReviewsConfigsFeaturedProducts = this.look.productHotSpots.map(x => {
                return {
                    api_key: this.$attrs.prApiKey,
                    locale: 'en_US',
                    merchant_group_id: this.$attrs.prMerchantGroupId,
                    merchant_id: this.$attrs.prMerchantId,
                    page_id: x.product.productCode,
                    review_wrapper_url: 'Product-Review?',
                    components: {
                        CategorySnippet: 'pr-' + x.product.productCode
                    }
                }
            });

            //let powerReviewsConfigsFeaturedAccessories = this.featuredAccessories.map(x => {
            //    return {
            //        api_key: this.$attrs.prApiKey,
            //        locale: 'en_US',
            //        merchant_group_id: this.$attrs.prMerchantGroupId,
            //        merchant_id: this.$attrs.prMerchantId,
            //        page_id: x.productCode,
            //        review_wrapper_url: 'Product-Review?',
            //        components: {
            //            CategorySnippet: 'pr-' + x.productCode
            //        }
            //    }
            //});

            let powerReviews = this.$window["POWERREVIEWS"];
            powerReviews.display.render(powerReviewsConfigsFeaturedProducts);
            //powerReviews.display.render(powerReviewsConfigsFeaturedAccessories);
        }

        protected getTop3Swatches(swatchesJson): string[] {
            let retVal = [];
            if (swatchesJson) {
                let swatches = JSON.parse(swatchesJson) as any[];

                if (swatches.length > 0) {
                    var sorted = [];

                    swatches.forEach(x => {
                        let item = sorted.find(y => y.ModelNumber === x.ModelNumber);

                        if (item == null) {
                            sorted.push({ ModelNumber: x.ModelNumber, Count: 1 });
                        }
                        else {
                            item.Count++;
                        }
                    });
                    sorted.sort((a, b) => a.Count > b.Count ? 1 : -1);
                    sorted = sorted.reverse();
                    
                    retVal = swatches.filter(x => x.ModelNumber === sorted[0].ModelNumber).slice(0, 3).map((x: any) => x.ImageName);
                }
            }

            return retVal;
        }

        protected getSwatchesCount(swatchesJson): number {
            let retVal = 0;
            if (swatchesJson) {
                let swatches = JSON.parse(swatchesJson) as any[];

                retVal = swatches.length;
            }

            return retVal;
        }

        protected isAttributeValue(product: ProductDto, attrName: string, attrValue: string): boolean {
            let retVal: boolean = false;

            if (product && product.attributeTypes) {
                var attrType = product.attributeTypes.find(x => x.name === attrName && x.isActive === true);

                if (attrType) {
                    var matchingAttrValue = attrType.attributeValues.find(y => y.value === attrValue);

                    if (matchingAttrValue) {
                        retVal = true;
                    }
                }
            }
            return retVal;
        }

        protected cEqualize(): void {
            const $itemBlocks = $(".item-block__product");
            if ($itemBlocks.length > 0) {
                let thumbHeight = -1;
                let productInfoHeight = -1;

                $itemBlocks.each((i, elem) => {
                    const $elem = $(elem);
                    thumbHeight = thumbHeight > $elem.find(".item-block__product__img-wrap").height() ? thumbHeight : $elem.find(".item-block__product__img-wrap").height();
                    productInfoHeight = productInfoHeight > $elem.find(".item-block__product__details").height() ? productInfoHeight : $elem.find(".item-block__product__details").height();
                });
                if (productInfoHeight > 0) {
                    $itemBlocks.each((i, elem) => {
                        const $elem = $(elem);
                        $elem.find(".item-block__product__img-wrap").height(thumbHeight);
                        $elem.find(".item-block__product__details").height(productInfoHeight);
                        $elem.addClass("eq");
                    });
                }
            }
        }

        // Equalize the product grid after all of the images have been downloaded or they will be misaligned (grid view only)
        protected waitForDom(tries?: number): void {
            if (isNaN(+tries)) {
                tries = 1000; // Max 20000ms
            }

            // If DOM isn't ready after max number of tries then stop
            if (tries > 0) {
                setTimeout(() => {
                    if (this.imagesLoaded >= this.look.productHotSpots.filter(x => x.isAccessory || x.isFeatured).length) {
                        this.cEqualize();
                    } else {
                        this.waitForDom(tries - 1);
                    }
                }, 20);
            }
        }
    }
    angular
        .module("insite")
        .filter("validateHotSpots", () => hotSpots => {
            var validHotSpots = [];
            angular.forEach(hotSpots,
                hotSpot => {
                    if (!hotSpot["isFeatured"] && !hotSpot["isAccessory"]) {
                        validHotSpots.push(hotSpot);
                    }
                });
            return validHotSpots;
        })
        .filter("featuredProducts", () => hotSpots => {
            var validHotSpots = [];
            angular.forEach(hotSpots,
                hotSpot => {
                    if (hotSpot["isFeatured"] === true) {
                        validHotSpots.push(hotSpot["product"]);
                    }
                });
            return validHotSpots;
        })
        .filter("featuredAccessories", () => hotSpots => {
            var validHotSpots = [];
            angular.forEach(hotSpots,
                hotSpot => {
                    if (hotSpot["isAccessory"] === true) {
                        validHotSpots.push(hotSpot["product"]);
                    }
                });
            return validHotSpots;
        })
        .controller("NbfShopTheLookWidgetController", NbfShopTheLookWidgetController);
}