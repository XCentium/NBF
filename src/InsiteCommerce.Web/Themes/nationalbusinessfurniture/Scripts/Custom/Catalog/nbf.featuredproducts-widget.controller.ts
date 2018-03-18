module insite.catalog {
    "use strict";

    export interface IFeaturedProductsWidgetControllerAttributes extends ng.IAttributes {
        productNumbersString: string;
    }

    export class FeaturedProductsWidgetController {
        erpNumbers: string[];
        products: ProductDto[]; 
        favoritesWishlist: WishListModel;
        isAuthenticated: boolean = false;

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
            const expand = ["pricing", "attributes"];
            var params = {
                erpNumbers: this.erpNumbers
            } as IProductCollectionParameters;

            this.productService.getProducts(params, expand).then(
                (result) => {
                    this.products = result.products;
                    this.getFavorites();

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
    }

    angular
        .module("insite")
        .controller("FeaturedProductsWidgetController", FeaturedProductsWidgetController);
}
