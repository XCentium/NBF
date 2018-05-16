module insite.catalog {
    "use strict";

    export interface IFeaturedProductsWidgetControllerAttributes extends ng.IAttributes {
        productNumbersString: string;
        prApiKey: string;
        prMerchantGroupId: string;
        prMerchantId: string;
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
                    this.imagesLoaded = 0;
                    this.waitForDom();

                    this.sessionService.getIsAuthenticated().then(x => {
                        this.isAuthenticated = x;
                        if (x) {
                            this.getFavorites();
                        }
                    });

                    setTimeout(() => {
                        this.setPowerReviews();
                    }, 1000);
                }
            );            
        }

        protected setPowerReviews() {
            let powerReviewsConfigs = this.products.map(x => {
                return {
                    api_key: this.$attrs.prApiKey,
                    locale: 'en_US',
                    merchant_group_id: this.$attrs.prMerchantGroupId,
                    merchant_id: this.$attrs.prMerchantId,
                    page_id: x.productCode,
                    review_wrapper_url: 'Product-Review?',
                    components: {
                        CategorySnippet: 'pr-' + x.productCode
                    }
                }
            });

            let powerReviews = this.$window["POWERREVIEWS"];
            powerReviews.display.render(powerReviewsConfigs)
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
                this.$rootScope.$broadcast("AnalyticsEvent", "AddProductToWishList");
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
    }

    angular
        .module("insite")
        .controller("FeaturedProductsWidgetController", FeaturedProductsWidgetController);
}
