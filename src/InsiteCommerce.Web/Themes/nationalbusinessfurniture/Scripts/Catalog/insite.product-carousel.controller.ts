﻿module insite.catalog {
    import ProductCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.ProductCollectionModel;
    "use strict";

    export interface IProductCarouselAttributes {
        productCarouselType: string;
        relatedProductType: string;
        isProductDetailPage: boolean;
        numberOfProductsToDisplay: number;
        seedWithManuallyAssigned: string;
        enableDynamicRecommendations: boolean;
        productCarouselId: string;
        selectedCategoryIds: string;
        isCatalogPage: boolean;
    }

    export class ProductCarouselController {
        parentProduct: ProductDto;
        products: ProductDto[];
        imagesLoaded: number;
        carousel: any;
        productSettings: ProductSettingsModel;
        failedToGetRealTimePrices = false;
        addingToCart = true;
        productCarouselType: string;
        relatedProductType: string;
        isProductDetailPage: boolean;
        numberOfProductsToDisplay: number;
        seedWithManuallyAssigned: string;
        enableDynamicRecommendations: boolean;
        productCarouselElement: any;
        selectedCategoryIds = [];
        isCatalogPage: boolean;

        static $inject = ["cartService", "productService", "$timeout", "addToWishlistPopupService", "settingsService", "$scope", "$attrs", "queryString", "$stateParams"];

        constructor(
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected $timeout: ng.ITimeoutService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected settingsService: core.ISettingsService,
            protected $scope: ng.IScope,
            protected $attrs: IProductCarouselAttributes,
            protected queryString: common.IQueryStringService,
            protected $stateParams: IProductListStateParams) {
            this.init();
        }

        init(): void {
            this.productCarouselType = this.$attrs.productCarouselType;
            this.relatedProductType = this.$attrs.relatedProductType;
            this.isProductDetailPage = this.$attrs.isProductDetailPage.toString().toLowerCase() === "true";
            this.numberOfProductsToDisplay = this.$attrs.numberOfProductsToDisplay;
            this.seedWithManuallyAssigned = this.$attrs.seedWithManuallyAssigned;
            if (this.$attrs.selectedCategoryIds) {
                this.selectedCategoryIds = this.$attrs.selectedCategoryIds.split(",");
            }

            const isSearchPage = this.$stateParams.criteria || this.queryString.get("criteria");
            this.isCatalogPage = this.$attrs.isCatalogPage.toString().toLowerCase() === "true" && !isSearchPage;
            
            this.enableDynamicRecommendations = this.$attrs.enableDynamicRecommendations.toString().toLowerCase() === "true";
            this.productCarouselElement = angular.element("[product-carousel-id='" + this.$attrs.productCarouselId + "']");

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.products = [];

            const cart = this.cartService.getLoadedCurrentCart();
            if (!cart) {
                this.$scope.$on("cartLoaded", () => {
                    this.addingToCart = false;
                });
            } else {
                this.addingToCart = false;
            }

            this.$scope.$on("cartChanged", () => {
                if (this.productCarouselType === "CustomersAlsoPurchased" && !this.isProductDetailPage) {
                    this.getCrossSells();
                }
            });

            this.$scope.$on("productLoaded", (event: ng.IAngularEvent, product: ProductDto) => {
                if (!this.isProductLoaded()) {
                    this.parentProduct = product;
                    this.getCrossSells();
                }
            });

            this.$scope.$on("categoryLoaded", (event: ng.IAngularEvent, categoryId: System.Guid) => {
                if (this.isCatalogPage) {
                    this.selectedCategoryIds = [categoryId];
                    this.getCrossSells();
                }
            });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.productSettings = settingsCollection.productSettings;
            if (!this.isProductDetailPage) {
                this.getCrossSells();
            }
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getCrossSells(): void {
            if (typeof (this.productSettings) === "undefined") {
                return;
            }

            if (this.productCarouselType === "RecentlyViewed") {
                if (this.isProductDetailPage && !this.isProductLoaded()) {
                    return;
                }
                this.productService.getProducts({}, ["pricing", "recentlyviewed"]).then(
                    (productCollection: ProductCollectionModel) => { this.getProductsCompleted(productCollection); },
                    (error: any) => { this.getProductsFailed(error); });
            }
            else if (this.productCarouselType === "WebCrossSells") {
                this.productService.getCrossSells(null).then(
                    (productCollection: CrossSellCollectionModel) => { this.getProductsCompleted(productCollection); },
                    (error: any) => { this.getProductsFailed(error); });
            } else if (this.productCarouselType === "RelatedProducts") {
                if (this.isProductLoaded()) {
                    this.products = [];
                    angular.forEach(this.parentProduct.relatedProducts, (relatedProduct: RelatedProductDto) => {
                        if (relatedProduct.relatedProductType === this.relatedProductType) {
                            this.products.push(relatedProduct.productDto);
                        }
                    });
                    this.waitForCarouselAndImages();
                }
            } else if (this.productCarouselType === "CustomersAlsoPurchased") {
                if (!this.enableDynamicRecommendations) {
                    return;
                }

                if (this.isProductDetailPage) {
                    if (!this.isProductLoaded()) {
                        return;
                    }

                    this.productService.getProductByParameters({ productId: this.parentProduct.id.toString(), alsoPurchasedMaxResults: this.numberOfProductsToDisplay, expand: "alsoPurchased" }).then(
                        (productModel: ProductModel) => { this.getProductCompleted(productModel); },
                        (error: any) => { this.getProductFailed(error); });
                } else {
                    this.cartService.expand = "alsoPurchased";
                    this.cartService.alsoPurchasedMaxResults = this.numberOfProductsToDisplay;
                    this.cartService.getCart().then(
                        (cart: CartModel) => { this.getCartCompleted(cart); },
                        (error: any) => { this.getCartFailed(error); });
                }
            } else if (this.productCarouselType === "TopSellers") {
                if (!this.enableDynamicRecommendations) {
                    return;
                }

                if (this.isCatalogPage && this.selectedCategoryIds.length === 0) {
                    return;
                }

                this.productService.getProducts({ topSellersCategoryIds: this.selectedCategoryIds, topSellersMaxResults: this.numberOfProductsToDisplay }, null, ["topsellers"]).then(
                    (productCollection: ProductCollectionModel) => { this.getProductsCompleted(productCollection); },
                    (error: any) => { this.getProductsFailed(error); });
            }
        }

        protected getProductsCompleted(productCollection: CrossSellCollectionModel): void {
            this.onCarouselProductsLoaded(productCollection.products);
        }

        protected getProductsFailed(error: any) {
        }

        protected getProductCompleted(productModel: ProductModel): void {
            var products: ProductDto[] = productModel.product.alsoPurchasedProducts;
            if (this.isProductLoaded() && this.seedWithManuallyAssigned && products.length < this.numberOfProductsToDisplay) {
                angular.forEach(this.parentProduct.relatedProducts, (relatedProduct: RelatedProductDto) => {
                    if (products.length < this.numberOfProductsToDisplay && relatedProduct.relatedProductType === this.seedWithManuallyAssigned && products.every(o => o.id !== relatedProduct.productDto.id)) {
                        products.push(relatedProduct.productDto);
                    }
                });
            }

            this.onCarouselProductsLoaded(products);
        }

        protected getProductFailed(error: any) {
        }

        protected getCartCompleted(cart: CartModel): void {
            this.onCarouselProductsLoaded(cart.alsoPurchasedProducts);
        }

        protected getCartFailed(error: any): void {
        }

        protected onCarouselProductsLoaded(products: ProductDto[]): void {
            this.products = products;
            if (this.parentProduct) {
                this.products = this.products.filter((product: ProductDto) => product.id !== this.parentProduct.id);
            }

            this.waitForCarouselAndImages();
            setTimeout(() => {
                if (this.carousel) {
                    this.carousel.resize();
                }
            });

            if (this.productSettings.realTimePricing && this.products && this.products.length > 0) {
                this.productService.getProductRealTimePrices(this.products).then(
                    (realTimePricing: RealTimePricingModel) => this.getProductRealTimePricesCompleted(realTimePricing),
                    (error: any) => this.getProductRealTimePricesFailed(error));
            }
        }

        protected getProductRealTimePricesCompleted(realTimePricing: RealTimePricingModel): void {
        }

        protected getProductRealTimePricesFailed(error: any): void {
            this.failedToGetRealTimePrices = true;
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

        showCarousel(): boolean {
            return !!this.products && this.products.length > 0;
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
            return product.canShowUnitOfMeasure
                && !!product.unitOfMeasureDisplay
                && !product.quoteRequired;
        }

        protected waitForCarouselAndImages(tries?: number): void {
            if (typeof (tries) === "undefined") {
                this.imagesLoaded = 0;
                tries = 1000; // Max 20s
            }

            if (tries > 0) {
                this.$timeout(() => {
                    if ($(".cs-carousel", this.productCarouselElement).length > 0 && this.imagesLoaded >= this.products.length) {
                        this.initializeCarousel();
                        this.$scope.$apply();
                    } else {
                        this.waitForCarouselAndImages(tries - 1);
                    }
                }, 20, false);
            }
        }

        protected isProductLoaded(): boolean {
            return this.parentProduct && typeof this.parentProduct === "object";
        }

        protected initializeCarousel(): void {
            const num = $(".cs-carousel .isc-productContainer", this.productCarouselElement).length;
            const itemsNum: number = this.getItemsNumber();

            $(".cs-carousel", this.productCarouselElement).flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: false,
                touch: num > itemsNum,
                itemWidth: this.getItemSize(),
                minItems: this.getItemsNumber(),
                maxItems: this.getItemsNumber(),
                move: this.getItemsMove(),
                customDirectionNav: $(".carousel-control-nav", this.productCarouselElement),
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

            const container = $(".cs-carousel", this.productCarouselElement);
            if (container.innerWidth() > 768) {
                this.carousel.vars.move = 2;
            } else {
                this.carousel.vars.move = 1;
            }
        }

        protected getItemSize(): number {
            const el = $(".cs-carousel", this.productCarouselElement);
            let width = el.innerWidth();

            if (width > 768) {
                width = width / 4;
            } else if (width > 480) {
                width = width / 3;
            }
            return width;
        }

        protected getItemsMove(): number {
            const container = $(".cs-carousel", this.productCarouselElement);
            if (container.innerWidth() > 768) {
                return 2;
            } else {
                return 1;
            }
        }

        protected getItemsNumber(): number {
            const el = $(".cs-carousel", this.productCarouselElement);
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

            const num = $(".cs-carousel .isc-productContainer", this.productCarouselElement).length;
            const el = $(".cs-carousel", this.productCarouselElement);
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
            $(".cs-carousel ul li", this.productCarouselElement).css("width", `${width}.px`);
            this.equalizeCarouselDimensions();
        }

        protected equalizeCarouselDimensions(): void {
            if ($(".carousel-item-equalize", this.productCarouselElement).length > 0) {
                let maxHeight = -1;
                let maxThumbHeight = -1;
                let maxNameHeight = -1;
                let maxProductInfoHeight = -1;

                const navHeight = `min-height:${$("ul.item-list", this.productCarouselElement).height()}`;
                $(".left-nav-2", this.productCarouselElement).attr("style", navHeight);

                // clear the height overrides
                $(".carousel-item-equalize", this.productCarouselElement).each(function () {
                    const $this = $(this);
                    $this.find(".item-thumb").height("auto");
                    $this.find(".item-name").height("auto");
                    $this.find(".product-info").height("auto");
                    $this.height("auto");
                });

                // find the max heights
                $(".carousel-item-equalize", this.productCarouselElement).each(function () {
                    const $this = $(this);
                    const thumbHeight = $this.find(".item-thumb").height();
                    maxThumbHeight = maxThumbHeight > thumbHeight ? maxThumbHeight : thumbHeight;
                    const nameHeight = $this.find(".item-name").height();
                    maxNameHeight = maxNameHeight > nameHeight ? maxNameHeight : nameHeight;
                    const productInfoHeight = $this.find(".product-info").height();
                    maxProductInfoHeight = maxProductInfoHeight > productInfoHeight ? maxProductInfoHeight : productInfoHeight;

                });

                // set all to max heights
                if (maxThumbHeight > 0) {
                    $(".carousel-item-equalize", this.productCarouselElement).each(function () {
                        const $this = $(this);
                        $this.find(".item-thumb").height(maxThumbHeight);
                        $this.find(".item-name").height(maxNameHeight);
                        $this.find(".product-info").height(maxProductInfoHeight);
                        const height = $this.height();
                        maxHeight = maxHeight > height ? maxHeight : height;
                        $this.addClass("eq");
                    });
                    $(".carousel-item-equalize", this.productCarouselElement).height(maxHeight);
                }
            }
        }

        protected showCarouselArrows(shouldShowArrows: boolean): void {
            if (shouldShowArrows) {
                $(".carousel-control-nav", this.productCarouselElement).show();
            } else {
                $(".carousel-control-nav", this.productCarouselElement).hide();
            }
        }
    }

    angular
        .module("insite")
        .controller("ProductCarouselController", ProductCarouselController);
}