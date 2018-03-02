//import CategoryFacetDto = Insite.Core.Plugins.Search.Dtos.CategoryFacetDto;
//import AttributeTypeFacetDto = Insite.Core.Plugins.Search.Dtos.AttributeTypeFacetDto;
//import AttributeValueDto = Insite.Catalog.Services.Dtos.AttributeValueDto;

module insite.catalog {
    "use strict";

    //export interface IProductListStateParams extends IContentPageStateParams {
    //    criteria: string;
    //}

    //export interface ICustomPagerContext {
    //    isSearch: boolean;
    //    view: string;
    //    selectView: (viewName: string) => void;
    //    attributeTypeFacets: AttributeTypeFacetDto[];
    //    changeTableColumn: (attribute: AttributeTypeFacetDto) => void;
    //    sortedTableColumns: AttributeTypeFacetDto[];
    //};

    export class NbfProductListController extends ProductListController{
        categoryAttr: string;
        filteredResults: boolean = false;

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


            $(document).ready(function () {
                var windowsize = $(window).width();
                if (windowsize < 767) {
                    setTimeout(
                        function () {
                            $('#accord-10000').prop('checked', false);
                        }, 2000);                    
                    $('#accord-10000').removeAttr('checked');
                }
            })
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
            if (this.categoryAttr != '') {
                this.filteredResults = true;
                if (!params.names) {
                    params.names = [];
                }
                params.names.push(this.categoryAttr);
            }
            window.console.dir(params);
            expand = expand ? expand : ["pricing", "attributes", "facets"];
            this.productService.getProducts(params, expand).then(
                (productCollection: ProductCollectionModel) => { this.getProductsCompleted(productCollection, params, expand); },
                (error: any) => { this.getProductsFailed(error); });
        }

        protected getProductsCompleted(productCollection: ProductCollectionModel, params: IProductCollectionParameters, expand?: string[]): void {
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
            if (this.view === "grid") {
                this.waitForDom();
            }
        }

        protected getFacets(categoryId: string): void {
            const params = {
                priceFilters: this.priceFilterMinimums,
                categoryId: categoryId,
                includeSuggestions: this.includeSuggestions,
                names: null
            };
            if (this.categoryAttr != '') {
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
    }

    angular
        .module("insite")
        .controller("ProductListController", NbfProductListController);
}