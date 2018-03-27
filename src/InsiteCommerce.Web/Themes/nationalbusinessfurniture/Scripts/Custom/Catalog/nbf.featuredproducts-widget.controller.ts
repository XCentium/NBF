﻿module insite.catalog {
    "use strict";

    export interface IFeaturedProductsWidgetControllerAttributes extends ng.IAttributes {
        productNumbersString: string;
    }

    export class FeaturedProductsWidgetController {
        erpNumbers: string[];
        products: ProductDto[]; 
        favoritesWishlist: WishListModel;
        isAuthenticated: boolean = false;
        imagesLoaded: number;

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "$attrs", "productService", "sessionService", "nbfWishListService"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected $attrs: IFeaturedProductsWidgetControllerAttributes,
            protected productService: IProductService,
            protected sessionService: account.ISessionService,
            protected nbfWishListService: wishlist.INbfWishListService) {
            this.init();
        }

        init(): void {
            this.erpNumbers = this.$attrs.productNumbersString.split(":");
            this.getProducts();
        }

        protected getProducts(): void {
            const expand = ["pricing", "attributes", "specifications"];
            var params = {
                erpNumbers: this.erpNumbers
            } as IProductCollectionParameters;

            this.productService.getProducts(params, expand).then(
                (result) => {
                    this.products = result.products;
                    this.getFavorites();
                    this.imagesLoaded = 0;
                    this.waitForDom();

                    this.sessionService.getIsAuthenticated().then(x => {
                        this.isAuthenticated = x;
                    })
                }
            );            
        }

        protected getTop3Swatches(swatchesJson): string[] {
            let retVal = [];
            if (swatchesJson) {
                let swatches = JSON.parse(swatchesJson) as any[];

                if (swatches.length > 0) {
                    var sorted = [];
                    
                    swatches.forEach(x => {
                        let item = sorted.find(y => y.ModelNumber == x.ModelNumber);

                        if (item == null) {
                            sorted.push({ModelNumber: x.ModelNumber, Count: 1})
                        }
                        else 
                        {
                            item.Count++;
                        }
                    });
                    sorted.sort((a, b) => a.Count > b.Count ? 1 : -1);
                    sorted = sorted.reverse();

                    retVal = swatches.filter(x => x.ModelNumber == sorted[0].ModelNumber).slice(0, 3).map((x: any) => x.ImageName);  
                }                
            }

            return retVal;
        }

        protected isAttributeValue(product: ProductDto, attrName: string, attrValue: string): boolean {
            let retVal: boolean = false;

            if (product && product.attributeTypes) {
                var attrType = product.attributeTypes.find(x => x.name == attrName && x.isActive == true);

                if (attrType) {
                    var matchingAttrValue = attrType.attributeValues.find(y => y.value == attrValue);

                    if (matchingAttrValue) {
                        retVal = true;
                    }
                }
            }
            return retVal;
        }

        protected toggleFavorite(product: ProductDto) {
            var favoriteLine = this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id);

            if (favoriteLine.length > 0) {
                //Remove lines
                this.nbfWishListService.deleteLineCollection(this.favoritesWishlist, favoriteLine).then((result) => {
                    this.getFavorites();
                });
            } else {
                //Add Lines
                var addLines = [product];
                this.nbfWishListService.addWishListLines(this.favoritesWishlist, addLines).then(() => {
                    this.getFavorites();
                });
            }
        }

        protected getFavorites() {
            this.nbfWishListService.getWishLists("CreatedOn", "wishlistlines").then((wishList) => {
                this.favoritesWishlist = wishList.wishListCollection[0];

                this.products.forEach(product => {
                    product.properties["isFavorite"] = "false";
                    if (this.favoritesWishlist) {
                        if (this.favoritesWishlist.wishListLineCollection) {
                            if (this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id)[0]) {
                                product.properties["isFavorite"] = "true";
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



        protected cEqualize(): void {
            const $itemBlocks = $(".item-block__product");
            if ($itemBlocks.length > 0) {
                let maxHeight = -1;
                let priceHeight = -1;
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
                    if (this.imagesLoaded >= this.products.length) {
                        this.cEqualize();
                    } else {
                        this.waitForDom(tries - 1);
                    }
                }, 20);
            }
        }

        protected getStarRating(product: ProductDto): string {
            let retVal = "no-star";
            debugger;
            if (product && product.specifications && product.specifications.length > 0) {
                let ratings = product.specifications.filter(x => x.name == "Rating");

                if (ratings.length > 0 && !isNaN(parseFloat(ratings[0].value))) {
                    let rating = parseFloat(ratings[0].value);
                    if (rating > 0.0) {
                        let ratingRoundedToHalf = Math.round(rating * 2) / 2;
                        retVal = ratingRoundedToHalf > 0 && ratingRoundedToHalf <= 0.5 ? "half-star" :
                            ratingRoundedToHalf > 0.5 && ratingRoundedToHalf <= 1.0 ? "one-star" :
                                ratingRoundedToHalf > 1.0 && ratingRoundedToHalf <= 1.5 ? "onehalf-star" :
                                    ratingRoundedToHalf > 1.5 && ratingRoundedToHalf <= 2.0 ? "two-star" :
                                        ratingRoundedToHalf > 2.0 && ratingRoundedToHalf <= 2.5 ? "twohalf-star" :
                                            ratingRoundedToHalf > 2.5 && ratingRoundedToHalf <= 3.0 ? "three-star" :
                                                ratingRoundedToHalf > 3.0 && ratingRoundedToHalf <= 3.5 ? "threehalf-star" :
                                                    ratingRoundedToHalf > 3.5 && ratingRoundedToHalf <= 4.0 ? "four-star" :
                                                        ratingRoundedToHalf > 4.0 && ratingRoundedToHalf <= 4.5 ? "fourhalf-star" :
                                                            ratingRoundedToHalf > 4.5 ? "five-star" : "no-star";
                    }
                }
            }

            return retVal;
        }

    }

    angular
        .module("insite")
        .controller("FeaturedProductsWidgetController", FeaturedProductsWidgetController);
}
