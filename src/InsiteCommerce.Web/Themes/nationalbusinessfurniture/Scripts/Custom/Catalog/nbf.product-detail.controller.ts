module insite.catalog {
    "use strict";

    
    export class NbfProductDetailController extends ProductDetailController {
        imageId: string;

        init(): void {
    
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => {
                    this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.$scope.$on("updateProductSubscription", (event: ng.IAngularEvent, productSubscription: ProductSubscriptionDto, product: ProductDto, cartLine: CartLineModel) => {
                this.onUpdateProductSubscription(event, productSubscription, product, cartLine);
            });
        }


        protected getProductCompleted(productModel: ProductModel): void {
            this.product = productModel.product;
            this.product.qtyOrdered = this.product.minimumOrderQty || 1;

            if (this.product.isConfigured && this.product.configurationDto && this.product.configurationDto.sections) {
                this.initConfigurationSelection(this.product.configurationDto.sections);
            }

            if (this.product.styleTraits.length > 0) {
                this.initialStyledProducts = this.product.styledProducts.slice();
                this.styleTraitFiltered = this.product.styleTraits.slice();
                this.initialStyleTraits = this.product.styleTraits.slice();
                if (this.product.isStyleProductParent) {
                    this.parentProduct = angular.copy(this.product);
                }
                this.initStyleSelection(this.product.styleTraits);
            }

            this.imageId = 'NationalBusinessFurniture/' + this.product.smallImagePath + '?wid=600';

            

            this.getRealTimePrices();
            if (!this.settings.inventoryIncludedWithPricing) {
                this.getRealTimeInventory();
            }

            this.setTabs();
        }


    }

    angular
        .module("insite")
        .controller("ProductDetailController", NbfProductDetailController);
}