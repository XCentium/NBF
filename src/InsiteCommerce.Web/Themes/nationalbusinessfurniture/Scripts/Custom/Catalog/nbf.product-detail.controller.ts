module insite.catalog {
    "use strict";

    export class NbfProductDetailController extends ProductDetailController {
        videoUrl: string = '';       
        swatches: any[] = [];

        static $inject = [
            "$scope",
            "coreService",
            "cartService",
            "productService",
            "addToWishlistPopupService",
            "productSubscriptionPopupService",
            "settingsService",
            "$stateParams",
            "sessionService",
            "nbfWishListService"];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected productSubscriptionPopupService: catalog.ProductSubscriptionPopupService,
            protected settingsService: core.ISettingsService,
            protected $stateParams: IContentPageStateParams,
            protected sessionService: account.ISessionService,
            protected nbfWishListService: wishlist.INbfWishListService
        ) {
            super($scope, coreService, cartService, productService, addToWishlistPopupService, productSubscriptionPopupService, settingsService, $stateParams, sessionService)
        }

        protected isAttributeValue(attrName: string, attrValue: string): boolean {            
            let retVal: boolean = false;

            if (this.product && this.product.attributeTypes) {
                var attrType = this.product.attributeTypes.find(x => x.name == attrName && x.isActive == true);

                if (attrType) {
                    var matchingAttrValue = attrType.attributeValues.find(y => y.value == attrValue);

                    if (matchingAttrValue) {
                        retVal = true;
                    }
                }                
            }

            return retVal;
        }

        protected getSwatchImageNameFromStyleTraitValueId(styleTraitName: string, styleTraitValue: string): string {
            debugger;
            let retVal: string = null;
            let styleTraitNameUpper = styleTraitName.toUpperCase();
            let styleTraitValueUpper = styleTraitValue.toUpperCase();

            if (this.swatches) {
                var swatch = this.swatches.find(x => x.ModelNumber.toUpperCase() == styleTraitNameUpper
                    && x.Name.toUpperCase() == styleTraitValueUpper);

                if (swatch) {
                    retVal = swatch.ImageName;
                }
            }
            return retVal;
        }


        protected selectInsiteStyleDropdown(styleTraitName: string, styleTraitValueId: string, index: number): void {            
            debugger;
            let styleTrait = this.styleTraitFiltered.find(x => x.nameDisplay == styleTraitName);
            if (styleTrait) {
                let option = styleTrait.styleValues.find(x => x.styleTraitValueId == styleTraitValueId);

                if (option) {
                    if (this.styleSelection[index] === option) {
                        this.styleSelection[index] = null;
                    }
                    else {
                        this.styleSelection[index] = option;
                    }
                    this.styleChange();
                }
            }
            //this.configurationSelection[$index] = 
            //let dropdownSelector = "select[name=tst_styleSelect_" + styleName + "]";
            //jQuery("select[name=tst_styleSelect_" + styleName + "]").val(styleTraitValueId);
                //.change();
            //jQuery(dropdownSelector + " option[value='" + styleTraitValueId + "']").prop({ defaultSelected: true });
            
        }               

        initVideo() {
            console.dir(document.getElementById("videofile"));
            document.getElementById("videofile").setAttribute("src", this.product.properties['videoUrl']);
        }

        protected getProductCompleted(productModel: ProductModel): void {
            this.product = productModel.product;
            this.product.qtyOrdered = this.product.minimumOrderQty || 1;
            this.product.documents.forEach((doc) => {
                if (doc.documentType == "video") {
                    this.product.properties['videoFile'] = doc.fileUrl;
                    this.product.properties['videoUrl'] = 'https://s7d9.scene7.com/is/content/NationalBusinessFurniture/' + doc.fileUrl;
                }
            });
            this.product.documents = this.product.documents.filter(function (val) {
                return val.documentType !== "video";
            });
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

            this.getRealTimePrices();
            if (!this.settings.inventoryIncludedWithPricing) {
                this.getRealTimeInventory();
            }

            if (this.product.properties && this.product.properties["swatches"]) {
                this.swatches = JSON.parse(this.product.properties["swatches"]);
            }

            this.setTabs();
        }     
       
        showVideo() {            
            setVideo2(this.product.properties['videoFile']);
        }

        show360() {            
            set360(this.product.erpNumber, 3, 16);
        }       
    }

    angular
        .module("insite")
        .controller("ProductDetailController", NbfProductDetailController);
}