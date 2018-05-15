module insite.catalog {
    "use strict";

    import AttributeValueFacetDto = Insite.Core.Plugins.Search.Dtos.AttributeValueFacetDto;
    import PriceFacetDto = Insite.Core.Plugins.Search.Dtos.PriceFacetDto;

    export class NbfCategoryLeftNavController extends CategoryLeftNavController {
        
        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "sessionService"];
        filterCheckBoxesModel: { [key: string]: boolean; } = {};

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected sessionService: account.ISessionService)
        {
            super($timeout, $window, $scope, $rootScope, sessionService);

            let self = this;

            var handler = function (event) {
                if ($(event.target).is(".accord-check, .f-wrap, .f-wrap *, .accord-check *") == false) {
                    // if the target is a descendent of accordion do nothing

                    let checkedFacetCheckboxes = Object.keys(self.filterCheckBoxesModel).reduce(function (filtered, key) {
                        if (self.filterCheckBoxesModel[key] == true) filtered[key] = self.filterCheckBoxesModel[key];
                        return filtered;
                    }, {});

                    if (Object.keys(checkedFacetCheckboxes).length > 0) {                       

                        Object.keys(checkedFacetCheckboxes).forEach(x => {
                            console.log(x);
                            self.filterCheckBoxesModel[x] = false;
                            self.$scope.$apply();
                        });
                    }
                }
            }

            $(".product-list").on("click", handler);
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
            for (let key in this.filterCheckBoxesModel) {
                if (key !== i) {
                    this.filterCheckBoxesModel[key] = false;
                }
            }
        }      
    }

    angular
        .module("insite")
        .controller("CategoryLeftNavController", NbfCategoryLeftNavController);
}