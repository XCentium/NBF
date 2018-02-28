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