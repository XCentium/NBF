﻿module insite.catalog {
    "use strict";

    import AttributeValueFacetDto = Insite.Core.Plugins.Search.Dtos.AttributeValueFacetDto;
    import PriceFacetDto = Insite.Core.Plugins.Search.Dtos.PriceFacetDto;

    export class NbfCategoryLeftNavController extends CategoryLeftNavController {
        
        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "sessionService", "$location"];
        filterCheckBoxesModel: { [key: string]: boolean; } = {};

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected sessionService: account.ISessionService,
            protected $location: ng.ILocaleService)
        {
            super($timeout, $window, $scope, $rootScope, sessionService);

            let self = this;

            //close the filter dropdown when clicking anywhere on page
            var handler = function (event) {
                if ($(event.target).is(".accord-check, .accord-head, .f-wrap, .f-wrap *, .accord-check *") == false) {
                    
                    // if the target is a descendent of accordion do nothing

                    let checkedFacetCheckboxes = Object.keys(self.filterCheckBoxesModel).reduce(function (filtered, key) {
                        if (self.filterCheckBoxesModel[key] == true) filtered[key] = self.filterCheckBoxesModel[key];
                        return filtered;
                    }, {});

                    if (Object.keys(checkedFacetCheckboxes).length > 0) {

                        Object.keys(checkedFacetCheckboxes).forEach(x => {
                            self.filterCheckBoxesModel[x] = false;  
                            if (!self.$scope.$$phase) {
                                self.$scope.$apply();
                            }
                        });
                    }
                }

                if (!self.$scope.$$phase) {
                    self.$scope.$apply();
                }
            }

            $("div").not(":input[type=checkbox], .accord-head, .accord-content, .f-wrap").on("click", handler);

            this.checkifmobile();
            $scope.$watch(() => this.attributeValues, (newVal, oldVal, scope) => self.onAttributeValuesChanged(newVal, oldVal, scope));
        }

        private onAttributeValuesChanged(newVal, oldVal, scope: ng.IScope) {
            var hasChanged = newVal.length != oldVal.length; 
            for (var i = 0; i < newVal.length && !hasChanged; i++) {
                if (newVal[i].sectionNameDisplay != oldVal[i].sectionNameDisplay || newVal[i].valueDisplay != oldVal[i].valueDisplay) {
                    hasChanged = true;
                    break;
                }
            }
            if (hasChanged) {
                var filters = "";
                for (var at of newVal) {
                    filters += `${at.sectionNameDisplay}:${at.valueDisplay},`;
                }
                filters = filters.slice(0, -1);
                this.$rootScope.$broadcast("AnalyticsEvent", "ProductListingFiltered", null, null, filters);
            }
            
        }

        checkifmobile() {

                var windowsize = $(window).width();
                if ($(".f-cat").length) {
                    if (windowsize < 767) {
                        setTimeout(
                            () => {
                                $("#accord-10000").prop("checked", false);
                            },
                            2000);
                        $("#accord-10000").removeAttr("checked");
                    }
                }
            

        }

        toggleFilter(attributeValueId: string) {
            (<any>this.$location).search("attr", "none");
            super.toggleFilter(attributeValueId);
        }

        clearFilters(): void {
            (<any>this.$location).search("attr", "none");
            super.clearFilters();           
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
