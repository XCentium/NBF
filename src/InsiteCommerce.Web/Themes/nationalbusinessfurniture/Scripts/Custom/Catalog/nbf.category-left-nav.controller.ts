module insite.catalog {
    "use strict";

    import AttributeValueFacetDto = Insite.Core.Plugins.Search.Dtos.AttributeValueFacetDto;
    import PriceFacetDto = Insite.Core.Plugins.Search.Dtos.PriceFacetDto;

    export class NbfCategoryLeftNavController extends CategoryLeftNavController {
        
        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "sessionService"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected sessionService: account.ISessionService)
        {
            super($timeout, $window, $scope, $rootScope, sessionService);
        }

       

        protected isViewAllCategoryFacetsCheckboxSelected(facets: CategoryFacetDto[]): boolean {
            let retVal = false;

            if (facets && facets.length > 0) {
                let selectedFacets = facets.filter(x => x.selected == true);
                retVal = selectedFacets.length > 0;
            }
            return retVal;
        }

        protected selectAllCategoryFacets(facets: CategoryFacetDto[]): void {
            if (facets && facets.length > 0) {
                facets.forEach(x => {
                    if (x.selected == true) {
                        this.toggleCategory(x);
                    }
                })
            }
        }


        protected isViewAllPriceFacetsCheckBoxSelected(facets: PriceFacetDto[]): boolean {
            let retVal = false;
            if (facets && facets.length > 0) {
                let selectedFacets = facets.filter(x => x.selected == true);
                retVal = selectedFacets.length > 0;
            }

            return retVal;
        }

        protected selectAllPriceFacets(facets: PriceFacetDto[]): void {
            if (facets && facets.length > 0) {
                facets.forEach(x => {
                    if (x.selected == true) {
                        this.togglePriceFilter(x.minimumPrice.toString());
                    }
                })
            }
        }

        protected isViewAllAttributeFiltersCheckboxSelected(facets: AttributeValueFacetDto[]): boolean {
            let retVal = false;
            if (facets && facets.length > 0) {
                let selectedFacets = facets.filter(x => x.selected == true);
                retVal = selectedFacets.length > 0;
            }

            return retVal;
        }

        protected selectAllAttributeFilters(facets: AttributeValueFacetDto[]): void {
            if (facets && facets.length > 0) {
                facets.forEach(x => {
                    if (x.selected == true) {
                        this.toggleFilter(x.attributeValueId.toString());
                    }
                })
            }
        }

        toggleexrtafilter(): void {
            $('.exrta-filter-wrap').toggleClass('collapsed');
        }
        toggleFacet(i): void {
            console.log(i);
            var element = $('#' + i);
            $('.product-list-filters .accord-check').not(element).prop('checked', false);
            console.log(element.prop('checked'));
        }




    }

    angular
        .module("insite")
        .controller("CategoryLeftNavController", NbfCategoryLeftNavController);
}