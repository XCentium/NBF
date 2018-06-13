module insite.catalog {
    "use strict";
    export interface IProductListControllerAttributes extends ng.IAttributes {
        prApiKey: string;
        prMerchantGroupId: string;
        prMerchantId: string;
    }

    export class NbfProductListController extends ProductListController{
        categoryAttr: string;
        filteredResults = false;
        favoritesWishlist: WishListModel;
        isAuthenticatedAndNotGuest = false;

        static $inject = [
            "$scope",
            "coreService",
            "cartService",
            "productService",
            "compareProductsService",
            "$rootScope",
            "$window",
            "$localStorage",
            "paginationService",
            "searchService",
            "spinnerService",
            "addToWishlistPopupService",
            "settingsService",
            "$stateParams",
            "queryString",
            "$location",
            "sessionService",
            "wishListService",
            "$attrs"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected compareProductsService: ICompareProductsService,
            protected $rootScope: ng.IRootScopeService,
            protected $window: ng.IWindowService,
            protected $localStorage: common.IWindowStorage,
            protected paginationService: core.IPaginationService,
            protected searchService: ISearchService,
            protected spinnerService: core.ISpinnerService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected settingsService: core.ISettingsService,
            protected $stateParams: IProductListStateParams,
            protected queryString: common.IQueryStringService,
            protected $location: ng.ILocationService,
            protected sessionService: account.ISessionService,
            protected wishListService: wishlist.IWishListService,
            protected $attrs: IProductListControllerAttributes) {

            super($scope, coreService, cartService, productService, compareProductsService, $rootScope, $window, $localStorage, paginationService, searchService, spinnerService, addToWishlistPopupService, settingsService, $stateParams, queryString, $location);
        }

        init(): void {
            this.products.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.filterCategory = { categoryId: null, selected: false, shortDescription: "", count: 0, subCategoryDtos: null, websiteId: null };
            this.view = this.$localStorage.get("productListViewName");

            
            this.getQueryStringValues();
            this.getHistoryValues();

            this.isSearch = this.query !== "";

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.$rootScope.$broadcast("AnalyticsPageType", "Product Listing Page");

            const removeCompareProductsUpdated = this.$rootScope.$on("compareProductsUpdated", () => {
                this.onCompareProductsUpdated();
            });

            this.$scope.$on("$destroy", () => {
                removeCompareProductsUpdated();
            });

            this.$scope.$on("CategoryLeftNavController-filterUpdated", (event: any, filterType: any) => {
                this.filterType = filterType;
                this.onCategoryLeftNavFilterUpdated();
            });

            this.initBackButton();

            this.$scope.$watch(() => this.category, (newCategory) => {
                if (!newCategory) {
                    return;
                }

                this.getFacets(newCategory.id);
            });

        }

        // params: object with query string parameters for the products REST service
        protected getProductData(params: IProductCollectionParameters, expand?: string[]): void {
            if (this.ready) {
                this.spinnerService.show("productlist");
            }
            if (this.categoryAttr !== "") {
                this.filteredResults = true;
                if (!params.names) {
                    params.names = [];
                }
                params.names.push(this.categoryAttr);
            }
            expand = expand ? expand : ["pricing", "attributes", "facets", "specifications"];
            this.productService.getProducts(params, expand).then(
                (productCollection: ProductCollectionModel) => { this.getProductsCompleted(productCollection, params, expand); },
                (error: any) => { this.getProductsFailed(error); });
        }

        protected getProductsCompleted(productCollection: ProductCollectionModel, params: IProductCollectionParameters, expand?: string[]): void {
            if (this.$window.dataLayer && productCollection.pagination) {
                this.$window.dataLayer.push({
                    'event': "searchResults",
                    'numSearchResults': productCollection.pagination.totalItemCount
                });
            }
            if (this.query && this.query.length > 0) {
                var search = new nbf.analytics.AnalyticsPageSearchInfo();
                search.searchResults = productCollection.pagination.totalItemCount;
                search.searchTerm = this.query;
                if (this.noResults) {
                    this.$rootScope.$broadcast("AnalyticsEvent", "FailedSearch", null, null, search);
                } else {
                    this.$rootScope.$broadcast("AnalyticsEvent", "SuccessfulSearch", null, null, search);
                }
            }


            if (productCollection.searchTermRedirectUrl) {
                // use replace to prevent back button from returning to this page
                if (productCollection.searchTermRedirectUrl.lastIndexOf("http", 0) === 0) {
                    this.$window.location.replace(productCollection.searchTermRedirectUrl);
                } else {
                    this.$location.replace();
                    this.coreService.redirectToPath(productCollection.searchTermRedirectUrl);
                }
                return;
            }
            if (this.filteredResults) {
                this.attributeValueIds = [];
                productCollection.attributeTypeFacets.forEach(attribute => {
                    attribute.attributeValueFacets.forEach(attValue => {
                        if (attValue.selected) {
                            this.attributeValueIds.push(attValue.attributeValueId.toString());
                        }
                    });
                });
            }
            this.$scope.$broadcast("ProductListController-filterLoaded");
            // got product data
            if (productCollection.exactMatch) {
                this.searchService.addSearchHistory(this.query, this.searchHistoryLimit, this.includeSuggestions.toLowerCase() === "true");
                this.coreService.redirectToPath(`${productCollection.products[0].productDetailUrl}?criteria=${encodeURIComponent(params.query)}`);
                return;
            }

            if (this.query.length > 0 && productCollection.products.length > 1) {
                var self = this;
                var filteredProduct = productCollection.products.filter(function (product) {
                    return product.erpNumber == self.query;
                });
                if (filteredProduct.length == 1) {
                    this.searchService.addSearchHistory(this.query, this.searchHistoryLimit, this.includeSuggestions.toLowerCase() === "true");
                    this.coreService.redirectToPath(`${filteredProduct[0].productDetailUrl}?criteria=${encodeURIComponent(params.query)}`);
                    return;
                }
            }

            if (!this.pageChanged) {
                this.loadProductFilter(productCollection, expand);
            }

            this.products = productCollection;
            this.products.products.forEach(product => {
                product.qtyOrdered = product.minimumOrderQty || 1;
            });

            this.reloadCompareProducts();

            //// allow the page to show
            this.ready = true;
            this.noResults = productCollection.products.length === 0;

            if (this.includeSuggestions === "true") {
                if (productCollection.originalQuery) {
                    this.query = productCollection.correctedQuery || productCollection.originalQuery;
                    this.originalQuery = productCollection.originalQuery;
                    this.autoCorrectedQuery = productCollection.correctedQuery != null && productCollection.correctedQuery !== productCollection.originalQuery;
                } else {
                    this.autoCorrectedQuery = false;
                }
            }

            this.searchService.addSearchHistory(this.query, this.searchHistoryLimit, this.includeSuggestions.toLowerCase() === "true");

            this.getRealTimePrices();
            if (!this.settings.inventoryIncludedWithPricing) {
                this.getRealTimeInventory();
            }

            this.imagesLoaded = 0;
            this.waitForDom();

            this.sessionService.getSession().then((session: SessionModel) => {
                if (session.isAuthenticated && !session.isGuest) {
                    this.isAuthenticatedAndNotGuest = true;
                }
                
                if (this.isAuthenticatedAndNotGuest) {
                    this.getFavorites();
                }
            });

            setTimeout(() => {
                this.setPowerReviews();
            }, 1000);
        }

        protected setPowerReviews() {
            let powerReviewsConfigs = this.products.products.map(x => {
                return {
                    api_key: this.$attrs.prApiKey,
                    locale: 'en_US',
                    merchant_group_id: this.$attrs.prMerchantGroupId,
                    merchant_id: this.$attrs.prMerchantId,
                    page_id: x.productCode,
                    review_wrapper_url: 'Product-Review?',
                    components: {
                        CategorySnippet: 'pr-' + x.erpNumber
                    }
                }
            });

            let powerReviews = this.$window["POWERREVIEWS"];
            powerReviews.display.render(powerReviewsConfigs)
        }

        protected getFacets(categoryId: string): void {
            const params = {
                priceFilters: this.priceFilterMinimums,
                categoryId: categoryId,
                includeSuggestions: this.includeSuggestions,
                names: null
            };
            if (this.categoryAttr !== "") {
                this.filteredResults = true;
                if (!params.names) {
                    params.names = [];
                }
                params.names.push(this.categoryAttr);
            }

            const expand = ["onlyfacets"];
            this.productService.getProducts(params, expand).then(
                (productCollection: ProductCollectionModel) => { this.getFacetsCompleted(productCollection) },
                (error: any) => { this.getFacetsFailed(error); });
        }

        protected getQueryStringValues(): void {
            this.query = this.$stateParams.criteria || this.queryString.get("criteria") || "";
            this.page = this.queryString.get("page") || null;
            this.pageSize = this.queryString.get("pageSize") || null;
            this.sort = this.queryString.get("sort") || null;
            this.includeSuggestions = this.queryString.get("includeSuggestions") || "true";
            //this.attributeValueIds = this.queryString.get("attributeValues");
            this.categoryAttr = this.queryString.get("attr");
        }

        //override to get better category information
        protected getCatalogPageCompleted(catalogPage: CatalogPageModel): void {
            if (catalogPage.productId) {
                return;
            }

            this.category = catalogPage.category;
            this.$rootScope.$broadcast("AnalyticsEvent", "BreadCrumbs", null, null, catalogPage.breadCrumbs.map(b => b.text).join(","));
            this.breadCrumbs = catalogPage.breadCrumbs;

            this.getProductData({
                categoryId: this.category.id,
                pageSize: this.pageSize || (this.products.pagination ? this.products.pagination.pageSize : null),
                sort: this.sort || this.$localStorage.get("productListSortType", ""),
                page: this.page,
                attributeValueIds: this.attributeValueIds,
                priceFilters: this.priceFilterMinimums,
                searchWithin: this.searchWithinTerms.join(" "),
                includeSuggestions: this.includeSuggestions,
                getAllAttributeFacets: true
            });

            //Have to do this to get htmlcontent
            this.productService.getCategory(catalogPage.category.id.toString()).then((catalogPageResult) => {
                this.category.htmlContent = catalogPageResult.htmlContent;
                if (catalogPageResult.properties["extraContent"]) {
                    if (!this.category.properties) {
                        this.category.properties = {};
                    }
                    this.category.properties["extraContent"] = catalogPageResult.properties["extraContent"];
                }
            });
        }

        protected getTop6Swatches(swatchesJson): string[] {
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

                    retVal = swatches.filter(x => x.ModelNumber === sorted[0].ModelNumber).slice(0, 6).map((x: any) => x.ImageName);
                }
            }

            return retVal;
        }

        protected getTotalSwatchCount(swatchesJson): number {
            let count = 0;
            if (swatchesJson) {
                const swatches = JSON.parse(swatchesJson) as any[];

                if (swatches.length > 0) {
                    count = swatches.length;
                }
            }

            return count;
        }

        protected isAttributeValue(product: ProductDto, attrName: string, attrValue: string): boolean {
            let retVal = false;

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

                this.products.products.forEach(product => {
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

        // Equalize the product grid after all of the images have been downloaded or they will be misaligned (grid view only)
        protected waitForDom(tries?: number): void {
            if (isNaN(+tries)) {
                tries = 1000; // Max 20000ms
            }

            // If DOM isn't ready after max number of tries then stop
            if (tries > 0) {
                setTimeout(() => {
                    ($(document) as any).foundation("equalizer","reflow");

                    if (this.view === "grid") {
                        if (this.imagesLoaded >= this.products.products.length) {
                            this.cEqualize();
                        } else {
                            this.waitForDom(tries - 1);
                        }
                    }
                }, 20);
            }
        }             
    }

    angular
        .module("insite")
        .controller("ProductListController", NbfProductListController);
}