module insite.catalog {
    "use strict";

    export interface INbfCategoryListControllerAttributes extends ng.IAttributes {
        categoryId: string;
    }

    export class NbfCategoryListController {
        categoryId: string;
        category: CategoryModel;

        static $inject = [
            "productService",
            "$attrs"
        ];

        constructor(
            protected productService: IProductService,
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

            if (this.categoryId === "Products Categories") {
                byArea = false;
            } else if (this.categoryId === "By-Area Categories") {
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
        protected getCategoryTreeCompleted(categoryResult: CategoryCollectionModel, byArea: boolean, useId: boolean): void {
            this.category = {} as CategoryModel;
            this.category.subCategories = categoryResult.categories;

            if (!useId) {
                var cats = [];
                if (byArea) {
                    this.category.subCategories.forEach((cat: CategoryModel) => {
                        if (cat.properties["isAreaCat"]) {
                            cats.push(cat);
                        }
                    });
                } else {

                    this.category.subCategories.forEach((cat: CategoryModel) => {
                        if (!cat.properties["isAreaCat"]) {
                            cats.push(cat);
                        }
                    });
                }
                this.category.subCategories = cats;
            }
        }

        protected getCategoryFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfCategoryListController", NbfCategoryListController);
}