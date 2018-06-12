module insite.catalog {
    "use strict";

    export interface IProductCarouselControllerAttributes extends ng.IAttributes {
        productNumbersString: string;
        prApiKey: string;
        prMerchantGroupId: string;
        prMerchantId: string;
    }

    export interface ProductCarouselProduct {
        erpNumber: string;
        sortOrder: number;
        product: ProductDto;
    }

    export class NbfProductCarouselController extends CrossSellCarouselController {
        erpNumbers: string[];
        products: ProductDto[];
        favoritesWishlist: WishListModel;
        isAuthenticatedAndNotGuest = false;

        static $inject = ["cartService", "productService", "$timeout", "addToWishlistPopupService", "settingsService", "$scope", "$window", "$attrs", "sessionService", "wishListService", "$rootScope" ];

        constructor(
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected $timeout: ng.ITimeoutService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected settingsService: core.ISettingsService,
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected $attrs: IFeaturedProductsWidgetControllerAttributes,
            protected sessionService: account.ISessionService,
            protected wishListService: wishlist.IWishListService,
            protected $rootScope: ng.IRootScopeService
        ) {
            super(cartService, productService, $timeout, addToWishlistPopupService, settingsService, $scope);
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.crossSellProducts = [];
            this.imagesLoaded = 0;

            const cart = this.cartService.getLoadedCurrentCart();
            if (!cart) {
                this.$scope.$on("cartLoaded", () => {
                    this.addingToCart = false;
                });
            } else {
                this.addingToCart = false;
            }
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.productSettings = settingsCollection.productSettings;
            this.erpNumbers = this.$attrs.productNumbersString.split(":");
            this.getProducts();
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getProducts(): void {
            const expand = ["pricing", "attributes", "specifications"];
            var params = {
                erpNumbers: this.erpNumbers
            } as IProductCollectionParameters;

            this.productService.getProducts(params, expand).then(
                (result) => {
                    this.products = result.products;
                    let sortedProducts: ProductDto[] = [];
                    this.erpNumbers.forEach((erp, i) => {
                        sortedProducts.push(this.products.find(x => x.erpNumber.toLowerCase().trim() === erp.toLowerCase().trim()));
                    });

                    //replace the original products list with the sorted list
                    this.products = sortedProducts.filter(x => x != null);

                    this.imagesLoaded = 0;
                    this.waitForDom(this.maxTries);

                    this.sessionService.getSession().then((session: SessionModel) => {
                        if (session.isAuthenticated && !session.isGuest) {
                            this.isAuthenticatedAndNotGuest = true;
                        }

                        if (this.isAuthenticatedAndNotGuest) {
                            this.getFavorites();
                        }
                    });

                    if (this.productSettings.realTimePricing && this.products && this.products.length > 0) {
                        this.productService.getProductRealTimePrices(this.products).then(
                            (realTimePricing: RealTimePricingModel) => this.getProductRealTimePricesCompleted(realTimePricing),
                            (error: any) => this.getProductRealTimePricesFailed(error));
                    }

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

        protected toggleFavorite(product: ProductDto) {
            var favoriteLine = this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id);

            if (favoriteLine.length > 0) {
                //Remove lines
                this.wishListService.deleteLineCollection(this.favoritesWishlist, favoriteLine).then(() => {
                    this.getFavorites();
                });
            } else {
                //Add Lines
                var addLines = [product];
                this.wishListService.addWishListLines(this.favoritesWishlist, addLines).then(() => {
                    this.getFavorites();
                });
                this.$rootScope.$broadcast("AnalyticsEvent", "AddProductToWishList");
            }
        }

        protected getFavorites() {
            this.wishListService.getWishLists("CreatedOn", "wishlistlines").then((wishList) => {
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

        addToCart(product: ProductDto): void {
            this.addingToCart = true;

            this.cartService.addLineFromProduct(product, null, null, true).then(
                (cartLine: CartLineModel) => { this.addToCartCompleted(cartLine); },
                (error: any) => { this.addToCartFailed(error); });
        }

        protected addToCartCompleted(cartLine: CartLineModel): void {
            this.addingToCart = false;
        }

        protected addToCartFailed(error: any): void {
            this.addingToCart = false;
        }

        changeUnitOfMeasure(product: ProductDto): void {
            this.productService.changeUnitOfMeasure(product).then(
                (productDto: ProductDto) => { this.changeUnitOfMeasureCompleted(productDto); },
                (error: any) => { this.changeUnitOfMeasureFailed(error); });
        }

        protected changeUnitOfMeasureCompleted(product: ProductDto): void {
        }

        protected changeUnitOfMeasureFailed(error: any): void {
        }

        openWishListPopup(product: ProductDto): void {
            this.addToWishlistPopupService.display([product]);
        }

        showCrossSellCarousel(): boolean {
            return !!this.crossSellProducts
                && this.crossSellProducts.length > 0
                && (!this.productCrossSell || !!this.productSettings);
        }

        showQuantityBreakPricing(product: ProductDto): boolean {
            return product.canShowPrice
                && product.pricing
                && !!product.pricing.unitRegularBreakPrices
                && product.pricing.unitRegularBreakPrices.length > 1
                && !product.quoteRequired;
        }

        showUnitOfMeasure(product: ProductDto): boolean {
            return product.canShowUnitOfMeasure
                && !!product.unitOfMeasureDisplay
                && !!product.productUnitOfMeasures
                && product.productUnitOfMeasures.length > 1
                && this.productSettings.alternateUnitsOfMeasure;
        }

        showUnitOfMeasureLabel(product: ProductDto): boolean {
            return product != null && product.canShowUnitOfMeasure
                && !!product.unitOfMeasureDisplay
                && !product.quoteRequired;
        }

        protected waitForProduct(tries: number): void {
            if (isNaN(+tries)) {
                tries = this.maxTries || 1000; // Max 20000ms
            }

            if (tries > 0) {
                this.$timeout(() => {
                    if (this.isProductLoaded()) {
                        this.crossSellProducts = this.product.crossSells;
                        this.imagesLoaded = 0;
                        this.$scope.$apply();
                        this.waitForDom(this.maxTries);
                    } else {
                        this.waitForProduct(tries - 1);
                    }
                }, 20, false);
            }
        }

        protected waitForDom(tries: number): void {
            if (isNaN(+tries)) {
                tries = this.maxTries || 1000; // Max 20000ms
            }

            // If DOM isn't ready after max number of tries then stop
            if (tries > 0) {
                this.$timeout(() => {
                    if (this.isCarouselDomReadyAndImagesLoaded()) {
                        this.initializeCarousel();
                        this.$scope.$apply();
                    } else {
                        this.waitForDom(tries - 1);
                    }
                }, 20, false);
            }
        }

        protected isCarouselDomReadyAndImagesLoaded(): boolean {
            return $(".cs-carousel").length > 0 && this.imagesLoaded >= this.crossSellProducts.length;
        }

        protected isProductLoaded(): boolean {
            return this.product && typeof this.product === "object";
        }

        protected initializeCarousel(): void {
            $(".cs-carousel").flexslider({
                animation: "slide",
                controlNav: true,
                animationLoop: true,
                slideshow: false,
                itemWidth: this.getItemSize(),
                minItems: this.getItemsNumber(),
                maxItems: this.getItemsNumber(),
                itemMargin: 36,
                move: this.getItemsMove(),
                controlsContainer: $(".custom-controls-container"),
                customDirectionNav: $(".carousel-control-nav"),
                start: (slider: any) => { this.onCarouselStart(slider); }
            });

            $(window).resize(() => { this.onWindowResize(); });
        }

        protected onCarouselStart(slider: any): void {
            this.carousel = slider;
            this.reloadCarousel();
            this.setCarouselSpeed();
        }

        protected onWindowResize(): void {
            this.reloadCarousel();
            this.setCarouselSpeed();
        }

        protected setCarouselSpeed(): void {
            if (!this.carousel) {
                return;
            }

            const container = $(".cs-carousel");
            if (container.innerWidth() > 768) {
                this.carousel.vars.move = 2;
            } else {
                this.carousel.vars.move = 1;
            }
        }

        protected getItemSize(): number {
            const el = $(".cs-carousel");
            let width = el.innerWidth();

            if (width > 768) {
                width = width / 4;
            } else if (width > 480) {
                width = width / 3;
            }
            return width;
        }

        protected getItemsMove(): number {
            const container = $(".cs-carousel");
            if (container.innerWidth() > 768) {
                return 2;
            } else {
                return 1;
            }
        }

        protected getItemsNumber(): number {
            const el = $(".cs-carousel");
            const width = el.innerWidth();
            let itemsNum: number;

            if (width > 768) {
                itemsNum = 4;
            } else if (width > 480) {
                itemsNum = 3;
            } else {
                itemsNum = 1;
            }
            return itemsNum;
        }

        protected reloadCarousel(): void {
            if (!this.carousel) {
                return;
            }

            const num = $(".cs-carousel .isc-productContainer").length;
            const el = $(".cs-carousel");
            let width = el.innerWidth();
            let itemsNum: number;

            if (width > 768) {
                width = width / 4;
                itemsNum = 4;
                this.showCarouselArrows(num > 4);
            } else if (width > 480) {
                width = width / 3;
                itemsNum = 3;
                this.showCarouselArrows(num > 3);
            } else {
                itemsNum = 1;
                this.showCarouselArrows(num > 1);
            }
            this.carousel.vars.minItems = itemsNum;
            this.carousel.vars.maxItems = itemsNum;
            this.carousel.vars.itemWidth = width;
            $(".cs-carousel ul li").css("width", `${width}.px`);
            this.equalizeCarouselDimensions();
        }

        protected equalizeCarouselDimensions(): void {
            if ($(".carousel-item-equalize").length > 0) {
                let maxHeight = -1;
                let maxThumbHeight = -1;
                let maxNameHeight = -1;
                let maxProductInfoHeight = -1;

                const navHeight = `min-height:${$("ul.item-list").height()}`;
                $(".left-nav-2").attr("style", navHeight);

                // clear the height overrides
                $(".carousel-item-equalize").each(function () {
                    $(this).find(".item-thumb").height("auto");
                    $(this).find(".item-name").height("auto");
                    $(this).find(".product-info").height("auto");
                    $(this).height("auto");
                });

                // find the max heights
                $(".carousel-item-equalize").each(function () {
                    const thumbHeight = $(this).find(".item-thumb").height();
                    maxThumbHeight = maxThumbHeight > thumbHeight ? maxThumbHeight : thumbHeight;
                    const nameHeight = $(this).find(".item-name").height();
                    maxNameHeight = maxNameHeight > nameHeight ? maxNameHeight : nameHeight;
                    const productInfoHeight = $(this).find(".product-info").height();
                    maxProductInfoHeight = maxProductInfoHeight > productInfoHeight ? maxProductInfoHeight : productInfoHeight;

                });

                // set all to max heights
                if (maxThumbHeight > 0) {
                    $(".carousel-item-equalize").each(function () {
                        $(this).find(".item-thumb").height(maxThumbHeight);
                        $(this).find(".item-name").height(maxNameHeight);
                        $(this).find(".product-info").height(maxProductInfoHeight);
                        const height = $(this).height();
                        maxHeight = maxHeight > height ? maxHeight : height;
                        $(this).addClass("eq");
                    });
                    $(".carousel-item-equalize").height(maxHeight);
                }
            }
        }

        protected showCarouselArrows(shouldShowArrows: boolean): void {
            if (shouldShowArrows) {
                $(".carousel-control-nav").show();
            } else {
                $(".carousel-control-nav").hide();
            }
        }        
    }

    angular
        .module("insite")
        .controller("NbfProductCarouselController", NbfProductCarouselController);
}