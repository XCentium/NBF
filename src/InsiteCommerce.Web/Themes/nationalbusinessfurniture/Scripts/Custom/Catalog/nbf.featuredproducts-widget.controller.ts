module insite.catalog {
    "use strict";

    export interface IFeaturedProductsWidgetControllerAttributes extends ng.IAttributes {
        productIdString: string;
    }

    export class FeaturedProductsWidgetController {
        productIds: string[];
        products: ProductModel[]; 

        static $inject = ["$timeout", "$window", "$scope", "$rootScope", "$attrs", "productService", "sessionService"];

        constructor(
            protected $timeout: ng.ITimeoutService,
            protected $window: ng.IWindowService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected $attrs: IFeaturedProductsWidgetControllerAttributes,
            protected productService: IProductService,
            protected sessionService: account.ISessionService) {
            this.init();
        }

        init(): void {
            this.productIds = this.$attrs.productIdString.split(":");
            this.getProducts();
        }

        protected getProducts(): void {
            const expand = ["pricing", "attributes"];
            this.products = [];
            this.productIds.forEach(id => {
                this.productService.getProduct(null, id, expand).then(
                    (x: any) => {
                        if (x && x.product) {
                            this.products.push(x.product);
                        }
                    },
                    (error: any) => {
                        console.error(error);
                    });
            });
        }
    }

    angular
        .module("insite")
        .controller("FeaturedProductsWidgetController", FeaturedProductsWidgetController);
}
