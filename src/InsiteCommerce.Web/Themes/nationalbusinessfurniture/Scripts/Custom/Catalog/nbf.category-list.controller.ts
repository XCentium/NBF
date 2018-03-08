module insite.catalog {
    "use strict";

    export interface INbfCategoryListControllerAttributes extends ng.IAttributes {
        categoryId: string;
    }

    export class NbfCategoryListController {
        categoryId: string;
        category: CategoryModel;

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
            protected $attrs: INbfCategoryListControllerAttributes) {
            this.init();
        }

        init(): void {
            this.categoryId = this.$attrs.categoryId;
            this.resolvePage();
        }

        protected resolvePage(): void {
            var id = null;
            var byArea = false;
            var useId = false;

            if (this.categoryId === "By-Area Categories") {
                byArea = true;
            } else {
                id = this.categoryId;
                useId = true;
            }
            this.productService.getCategoryTree(id, 1).then(
                (category: CategoryCollectionModel) => { this.getCategoryTreeCompleted(category, byArea, useId); },
                (error: any) => { this.getCategoryFailed(error); }
            );
        }

        //override to get better category information
        protected getCategoryTreeCompleted(category: CategoryCollectionModel, byArea: boolean, useId: boolean): void {
            this.category = {} as CategoryModel;
            this.category.subCategories = category.categories;

            if (!useId) {
                if (byArea) {
                    this.category.subCategories.filter(category => {
                        return category.properties["IsAreaCat"];
                    });
                } else {
                    this.category.subCategories.filter(category => {
                        return !category.properties["IsAreaCat"];
                    });
                }
            }
        }

        protected getCategoryFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfCategoryListController", NbfCategoryListController);
}