module insite.catalog {
    "use strict";


    export class NbfProductSearchController extends ProductSearchController {

        static $inject = ["$element", "$filter", "coreService", "searchService", "settingsService", "$state", "queryString", "$scope", "$rootScope"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $filter: ng.IFilterService,
            protected coreService: core.ICoreService,
            protected searchService: ISearchService,
            protected settingsService: core.ISettingsService,
            protected $state: angular.ui.IStateService,
            protected queryString: common.IQueryStringService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService
        ) {
            super($element, $filter, coreService, searchService, settingsService, $state, queryString, $scope);
        }

        search(query?: string, includeSuggestions?: boolean): void {
            var search = new nbf.analytics.AnalyticsPageSearchInfo();
            search.searchTerm = query;
            this.$rootScope.$broadcast("initAnalyticsEvent", "InternalSearch", null, null, search);
            super.search(query, includeSuggestions);
        }

        protected getAutocompleteProductTemplate(suggestion: any, pattern: string): string {
            const shortDescription = suggestion.title.replace(new RegExp(pattern, "gi"), "<strong>$1<\/strong>");

            let additionalInfo = "";

            if (suggestion.title) {
                let partNumberLabel: string;
                let partNumber: string;
                if (suggestion.isNameCustomerOverride) {
                    partNumberLabel = this.getTranslation("customerPartNumber") || "";
                    partNumber = suggestion.name || "";
                } else {
                    partNumberLabel = this.getTranslation("partNumber") || "";
                    partNumber = suggestion.erpNumber || "";
                }

                partNumber = partNumber.replace(new RegExp(pattern, "gi"), "<strong>$1<\/strong>");

                additionalInfo += `<span class='name'><span class='label'>${partNumberLabel}</span><span class='value tst_autocomplete_product_${suggestion.id}_number'>${partNumber}</span></span>`;
            }

            if (suggestion.manufacturerItemNumber) {
                const manufacturerItemNumber = suggestion.manufacturerItemNumber.replace(new RegExp(pattern, "gi"), "<strong>$1<\/strong>");
                const manufacturerItemNumberLabel = this.getTranslation("manufacturerItemNumber") || "";
                additionalInfo += `<span class='manufacturer-item-number'><span class='label'>${manufacturerItemNumberLabel}</span><span class='value'>${manufacturerItemNumber}</span></span>`;
            }

            return `<div class="group-${suggestion.type} tst_autocomplete_product_${suggestion.id}"><div class="image"><img src="https://s7d9.scene7.com/is/image/NationalBusinessFurniture/${suggestion.image}?hei=95&id=5-zsy2&fmt=jpg&fit=constrain,1&wid=95&hei=95"/></div><div><div class='shortDescription'>${shortDescription}</div>${additionalInfo}</div></div>`;
        }

        
    }

    angular
        .module("insite")
        .controller("ProductSearchController", NbfProductSearchController);
}