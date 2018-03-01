module insite.catalog {
    "use strict";

    export interface ICategoryWidgetControllerAttributes extends ng.IAttributes {
        categoryIdString: string;
    }

    export class CategoryWidgetController {
        categoryIds: string[];
        categories: CategoryModel[]; 

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "$attrs", "productService", "sessionService"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected $attrs: ICategoryWidgetControllerAttributes,
            protected productService: IProductService,
            protected sessionService: account.ISessionService) {
            this.init();
        }

        init(): void {
            this.categoryIds = this.$attrs.categoryIdString.split(":");

            this.getCategories();
        }

        protected getCategories(): void {
            this.categories = [];
            this.categoryIds.forEach(id => {
                this.productService.getCategory(id).then(
                    (category: CategoryModel) => {
                        if (category) {
                            this.categories.push(category);
                        }
                    },
                    (error: any) => {
                        
                    });
            });
        }
    }

    angular
        .module("insite")
        .controller("CategoryWidgetController", CategoryWidgetController);
}
