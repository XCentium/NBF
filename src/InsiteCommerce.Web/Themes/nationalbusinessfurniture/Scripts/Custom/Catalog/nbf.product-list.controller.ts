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
        //view: string;
        //attributeValueIds: string[] = [];
        //priceFilterMinimums: string[] = [];
        //filterCategory: CategoryFacetDto;
        //searchWithinTerms = [];
        //query: string;
        //ready = false;
        //products: ProductCollectionModel = {} as any;
        //settings: ProductSettingsModel;
        //category: CategoryModel;  // regular category page
        //breadCrumbs: BreadCrumbModel[];
        //searchCategory: CategoryModel; // searching within a category
        //page: number = null; // query string page
        //pageSize: number = null; // query string pageSize
        //sort: string = null; // query string sort
        //isSearch: boolean;
        //visibleTableProduct: ProductDto;
        //visibleColumnNames: string[] = [];
        //customPagerContext: ICustomPagerContext;
        //paginationStorageKey = "DefaultPagination-ProductList";
        //noResults: boolean;
        //pageChanged = false; // true when the pager has done something to change pages.
        //imagesLoaded: number;
        //originalQuery: string;
        //autoCorrectedQuery: boolean;
        //includeSuggestions: string;
        //searchHistoryLimit: number;
        //failedToGetRealTimePrices = false;
        //failedToGetRealTimeInventory = false;
        //productFilterLoaded = false;
        //filterType: string;
        //addingToCart = false;
        //initialAttributeTypeFacets: AttributeTypeFacetDto[];

        //static $inject = [
        //    "$scope",
        //    "coreService",
        //    "cartService",
        //    "productService",
        //    "compareProductsService",
        //    "$rootScope",
        //    "$window",
        //    "$localStorage",
        //    "paginationService",
        //    "searchService",
        //    "spinnerService",
        //    "addToWishlistPopupService",
        //    "settingsService",
        //    "$stateParams",
        //    "queryString",
        //    "$location"
        //];

        //constructor(
        //    protected $scope: ng.IScope,
        //    protected coreService: core.ICoreService,
        //    protected cartService: cart.ICartService,
        //    protected productService: IProductService,
        //    protected compareProductsService: ICompareProductsService,
        //    protected $rootScope: ng.IRootScopeService,
        //    protected $window: ng.IWindowService,
        //    protected $localStorage: common.IWindowStorage,
        //    protected paginationService: core.IPaginationService,
        //    protected searchService: ISearchService,
        //    protected spinnerService: core.ISpinnerService,
        //    protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
        //    protected settingsService: core.ISettingsService,
        //    protected $stateParams: IProductListStateParams,
        //    protected queryString: common.IQueryStringService,
        //    protected $location: ng.ILocationService) {
        //    this.init();
        //}

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
    }

    angular
        .module("insite")
        .controller("ProductListController", NbfProductListController);
}