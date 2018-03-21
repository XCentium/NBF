module insite.catalog {
    "use strict";

    export class NbfProductDetailController extends ProductDetailController {
        videoUrl = "";       
        swatches: any[] = [];
        favoritesWishlist: WishListModel;
        isAuthenticated: boolean = false;
        resourceAndAssemblyDocs: any[];

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
            this.sessionService.getIsAuthenticated().then((isAuth) => {
                this.isAuthenticated = isAuth;
            });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.productSettings;
            const context = this.sessionService.getContext();
            this.languageId = context.languageId;
            this.sessionService.getIsAuthenticated().then;
            this.resolvePage();
        }

        protected toggleFavorite(product: ProductDto) {
            var favoriteLine = this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id);

            if (favoriteLine.length > 0) {
                //Remove lines
                this.nbfWishListService.deleteLineCollection(this.favoritesWishlist, favoriteLine).then((result) => {
                    this.getFavorites();
                });     
            } else {
                //Add Lines
                var addLines = [product];
                this.nbfWishListService.addWishListLines(this.favoritesWishlist, addLines).then(() => {
                    this.getFavorites();
                });
            }
        }

        protected getFavorites() {
            this.nbfWishListService.getWishLists("CreatedOn", "wishlistlines").then((wishList) => {
                this.favoritesWishlist = wishList.wishListCollection[0];
                this.product.properties["isFavorite"] = "false";
                if (this.favoritesWishlist) {
                    if (this.favoritesWishlist.wishListLineCollection) {
                        if (this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === this.product.id)[0]) {
                            this.product.properties["isFavorite"] = "true";
                        }
                    } else {
                        this.favoritesWishlist.wishListLineCollection = [];
                    }
                } else {
                    this.favoritesWishlist = {
                        wishListLineCollection: [] as WishListLineModel[]
                    } as WishListModel;
                }
            });
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
            document.getElementById("videofile").setAttribute("src", this.product.properties["videoUrl"]);
        }

        protected getProductCompleted(productModel: ProductModel): void {
            this.product = productModel.product;
            this.product.qtyOrdered = this.product.minimumOrderQty || 1;
            this.product.documents.forEach((doc) => {
                if (doc.documentType == "video") {
                    this.product.properties["videoFile"] = doc.fileUrl;
                    this.product.properties["videoUrl"] = "https://s7d9.scene7.com/is/content/NationalBusinessFurniture/" + doc.fileUrl;
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
            this.sessionService.getIsAuthenticated().then(x => {
                this.isAuthenticated = x;
                if (this.isAuthenticated) {
                    this.getFavorites();
                }
            });

            this.resourceAndAssemblyDocs = this.product.documents.filter(x => x.documentType != "video");
        }     
       
        showVideo() {            
            this.setVideo2(this.product.properties["videoFile"]);
        }

        show360() {            
            this.set360(this.product.erpNumber, 3, 16);
        }

        setVideo2(vURL) {
            // used to display videos

            $("#s7flyout_inline_div").hide();
            $("#videofile").show();
            $("#Wrapper360").hide();
            $("#mobile_div_container").hide();
            var myVideo = document.getElementById("videofile");
            if (!myVideo.getAttribute("src")) {
                myVideo.setAttribute("src", "https://s7d9.scene7.com/is/content/NationalBusinessFurniture/" + vURL);
            }
            myVideo["play"]();
            console.dir(this.product);
        }

        set360(imageName, lanes, frames) {
            // used for 360 viewer
            var myVideo = document.getElementById("videofile");
            if (myVideo) {
                myVideo["pause"]();
            }

            var height = $("#s7flyout_inline_div").height();
            var width = height;
            var spriteSpin = document.getElementById("spritespin");
            if (spriteSpin.children.length == 0) {
                $("#spritespin")["spritespin"]({
                    source: SpriteSpin.sourceArray("https://s7d9.scene7.com/is/image/NationalBusinessFurniture/" + imageName + "2%5Fspin%5F{lane}{frame}s2?w=300", { lane: [1, lanes], frame: [1, frames], digits: 2 }),
                    width: width,
                    height: height,
                    frames: frames,
                    lanes: lanes,
                    sense: -2,
                    senseLane: -2,
                    renderer: "background",
                    behavior: "move",
                    frameTime: 250,
                });

            }

            $("#s7flyout_inline_div").hide();
            $("#defaultimage").hide();
            $("#360file").show();
            $("#videofile").hide();
            $("#Wrapper360").show();
            $("#overlaych1").hide();
            $("#mobile_div_container").hide();
        }
    }

    angular
        .module("insite")
        .controller("ProductDetailController", NbfProductDetailController);
}