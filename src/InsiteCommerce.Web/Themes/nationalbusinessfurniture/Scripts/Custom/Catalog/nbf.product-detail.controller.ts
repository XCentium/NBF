module insite.catalog {
    "use strict";
    export interface IProductDetailControllerAttributes extends ng.IAttributes {
        prApiKey: string;
        prMerchantGroupId: string;
        prMerchantId: string;
    }

    export class NbfProductDetailController extends ProductDetailController {
        videoUrl = "";       
        swatches: any[] = [];
        favoritesWishlist: WishListModel;
        isAuthenticatedAndNotGuest = false;
        resourceAndAssemblyDocs: any[];
        selectedSwatchProductIds: System.Guid[] = [];
        isSingleBlankSwatch: boolean = false;
        parentErpNumber: string = '';

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
            "wishListService",
            "spinnerService",
            "$window",
            "$anchorScroll",
            "$location",
            "$attrs",
            "$rootScope"
        ];

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
            protected wishListService: wishlist.IWishListService,
            protected spinnerService: core.ISpinnerService,
            protected $window: ng.IWindowService,
            protected $anchorScroll: ng.IAnchorScrollService,
            protected $location: ng.ILocationService,
            protected $attrs: IProductDetailControllerAttributes,
            protected $rootScope: ng.IRootScopeService
        ) {
            super($scope,
                coreService,
                cartService,
                productService,
                addToWishlistPopupService,
                productSubscriptionPopupService,
                settingsService,
                $stateParams,
                sessionService);
        }       

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.productSettings;
            const context = this.sessionService.getContext();
            this.languageId = context.languageId;
            this.resolvePage();
        }

        protected toggleFavorite(product: ProductDto) {
            var favoriteLine = this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id);

            if (favoriteLine.length > 0) {
                //Remove lines
                this.wishListService.deleteLineCollection(this.favoritesWishlist, favoriteLine).then((result) => {
                    this.getFavorites(product);
                });     
            } else {
                //Add Lines
                var addLines = [product];
                this.wishListService.addWishListLines(this.favoritesWishlist, addLines).then(() => {
                    this.getFavorites(product);
                });
                this.$rootScope.$broadcast("AnalyticsEvent", "AddProductToWishList");
            }
        }


        addToCart(product: ProductDto): void { 
            if ((((product.availability as any).messageType != 2 || product.canBackOrder) && product.allowedAddToCart && (product.canAddToCart || this.configurationCompleted || this.styleSelectionCompleted && !product.canConfigure)) == false) {

                if (this.styleSelectionCompleted == false) {
                    this.showUnstyledProductErrorModal();
                }
                else {
                    this.showProductCannotBeAddedToCartErrorModal();
                }

                return;
            }

            this.addingToCart = true;

            let sectionOptions: ConfigSectionOptionDto[] = null;
            if (this.configurationCompleted && product.configurationDto && product.configurationDto.sections) {
                sectionOptions = this.configurationSelection;
            }

            this.cartService.addLineFromProduct(product, sectionOptions, this.productSubscription, true).then(
                (cartLine: CartLineModel) => { this.addToCartCompleted(cartLine); },
                (error: any) => { this.addToCartFailed(error); }
            );
        }

        protected addToCartCompleted(cartLine: CartLineModel): void {           
            super.addToCartCompleted(cartLine);

            this.$anchorScroll();
        }        

        protected getFavorites(product : ProductDto) {
            this.wishListService.getWishLists("CreatedOn", "wishlistlines").then((wishList) => {
                this.favoritesWishlist = wishList.wishListCollection[0];
                product.properties["isFavorite"] = "false";
                if (this.favoritesWishlist) {
                    if (this.favoritesWishlist.wishListLineCollection) {
                        if (this.favoritesWishlist.wishListLineCollection.filter(x => x.productId === product.id)[0]) {
                            product.properties["isFavorite"] = "true";
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
            let retVal = false;

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

        protected getAttributeValue(attrName: string): string {
            let retVal: string = null;

            if (this.product && this.product.attributeTypes) {
                var attrType = this.product.attributeTypes.find(x => x.name == attrName && x.isActive == true);

                if (attrType && attrType.attributeValues && attrType.attributeValues.length > 0) {
                    retVal = attrType.attributeValues[0].valueDisplay;
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
        }   

        styleChange(): void {

            $('#Wrapper360').hide();
            var myVideo = $('#videofile');
            if (myVideo) {
                myVideo.trigger('pause');
            }
            $('#videofile').hide();
            super.styleChange();
            window.console.log("1 isConfigured = " + this.product.isConfigured);
            var isConfigured = true;
            this.product.styleTraits.forEach((trait) => {
                window.console.dir(trait);
                window.console.dir(this.styleSelection);
                if (this.styleSelection.filter(x => x && x.styleTraitId == trait.styleTraitId).length === 0) {
                    window.console.log('not found');
                    isConfigured = false;
                };
            });
            this.product.isConfigured = isConfigured;
            window.console.log("2 isConfigured = " + this.product.isConfigured);
            if (this.product.isConfigured) {
                $("#s7flyout_inline_div").empty();
                $('#s7flyout_inline_div').show();
            }
        }
        protected toggleSwatchProductSelection(styleTraitName: string, styleTraitValueId: string): void {
            let swatch = this.swatches.find(x => x.ModelNumber == styleTraitName
                && x.Name == styleTraitValueId);

            if (swatch != null) {
                if (this.selectedSwatchProductIds.filter(x => x == swatch.Id).length === 0) {
                    this.selectedSwatchProductIds.push(<System.Guid>swatch.Id);
                }
                else {
                    var index = this.selectedSwatchProductIds.indexOf(swatch.Id);
                    if (index !== -1) {
                        this.selectedSwatchProductIds.splice(index, 1);
                    }
                }
            }
        }

        protected isSwatchProductSelected(styleTraitName: string, styleTraitValueId: string) {
            let retVal = false;

            let swatch = this.swatches.find(x => x.ModelNumber == styleTraitName
                && x.Name == styleTraitValueId);

            if (swatch != null && this.selectedSwatchProductIds.filter(x => x == swatch.Id).length > 0) {
                retVal = true;
            }

            return retVal;
        }

        protected showSwatchOrderForm(): void {
            this.coreService.displayModal(angular.element("#swatchform"));
        }

        protected showUnstyledProductErrorModal(): void {
            this.coreService.displayModal(angular.element("#unstyledProductErrorModal"));
        } 

        protected showProductCannotBeAddedToCartErrorModal(): void {
            this.coreService.displayModal(angular.element("#productCannotBeAddedToCartErrorModal"));
        }

        protected hideSwatchOrderForm(): void {
            this.coreService.closeModal("#swatchform");
        }

        protected addSwatchProductsToCart() {
            let currentCart = this.cartService.getLoadedCurrentCart();
            let productIdsAlreadyInCart = currentCart.cartLines.map(x => x.productId);

            let productDtos = this.selectedSwatchProductIds
                .filter(x => productIdsAlreadyInCart.filter(y => y == x).length === 0)
                .map(x => {
                    return <ProductDto>{ id: x, qtyOrdered: 1, unitOfMeasure: 'EA' }
                });

            if (productDtos && productDtos.length > 0) {
                this.addingToCart = true;
                this.spinnerService.show();

                this.cartService.addLineCollectionFromProducts(productDtos, true, false).then(
                    (cartLine: CartLineCollectionModel) => {
                        this.selectedSwatchProductIds = [];
                        this.addingToCart = false;
                        this.spinnerService.hide();
                        this.hideSwatchOrderForm();
                    },
                    (error: any) => {
                        this.addingToCart = false;
                        this.spinnerService.hide();
                        this.addToCartFailed(error);
                    }
                );
            }
            else {
                this.selectedSwatchProductIds = [];
                this.hideSwatchOrderForm();
            }
        }

        initVideo() {
            document.getElementById("videofile").setAttribute("src", this.product.properties["videoUrl"]);
        }

        protected getProductCompleted(productModel: ProductModel): void {
            this.product = productModel.product;
            this.parentErpNumber = this.product.erpNumber;

            this.$rootScope.$broadcast("productPageLoaded", this.product);
            this.$rootScope.$broadcast("AnalyticsEvent", "ProductPageView", null, null, { product: this.product, breadcrumbs: this.breadCrumbs });
            
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
            this.sessionService.getSession().then((session: SessionModel) => {
                if (session.isAuthenticated && !session.isGuest) {
                    this.isAuthenticatedAndNotGuest = true;
                }
                
                if (this.isAuthenticatedAndNotGuest) {
                    this.getFavorites(this.parentProduct);
                }
            });

            this.resourceAndAssemblyDocs = this.product.documents.filter(x => x.documentType != "video");

            setTimeout(() => {
                this.setPowerReviews();
            }, 1000);            

            var self = this;
            $(document).on('click', '.pr-qa-display-btn', function () {
                self.$rootScope.$broadcast("AnalyticsEvent", "ProductQuestionStarted");
            });

            $(document).on('click', '.pr-snippet-review-count', function () {
                self.$rootScope.$broadcast("AnalyticsEvent", "ReadReviewsSelected");
            });

            this.handleSingleBlankSwatch();
        }   

        private handleSingleBlankSwatch(): void {
            if (this.product.styleTraits.length == 1) {
                let styleTrait = this.product.styleTraits[0];
                let styleValues = styleTrait.styleValues;

                if (styleValues != null && styleValues.length == 1) {
                    let style = styleValues[0];
                    let swatchImageName = this.getSwatchImageNameFromStyleTraitValueId(style.styleTraitName, style.value);

                    if (swatchImageName == null || swatchImageName.trim().length == 0) {
                        //Since there is a single blank swatch, select it by default
                        this.selectInsiteStyleDropdown(styleTrait.nameDisplay, style.styleTraitValueId as string, 0)
                        this.isSingleBlankSwatch = true;
                    }
                }
            }
        }

        private powerReviewsOnSubmit(config, data) {
            if (config.component === 'WriteAQuestion') {
                this.$rootScope.$broadcast("AnalyticsEvent", "ProductQuestionAsked");
            }
        }

        protected setPowerReviews() {
            var self = this;
            let powerReviewsConfig = {
                api_key: this.$attrs.prApiKey,
                locale: 'en_US',
                merchant_group_id: this.$attrs.prMerchantGroupId,
                merchant_id: this.$attrs.prMerchantId,
                page_id: this.product.productCode,
                review_wrapper_url: 'Product-Review?',
                components: {
                    ReviewSnippet: 'pr-reviewsnippet',
                    ReviewDisplay: 'pr-reviewdisplay',
                    //QuestionSnippet: 'pr-questionsnippet',
                    QuestionDisplay: 'pr-questiondisplay'
                },
                on_submit: (config, data) => self.powerReviewsOnSubmit(config, data)
            };


            let powerReviews = this.$window["POWERREVIEWS"];
            powerReviews.display.render(powerReviewsConfig);

        }

        protected readReviews() {
            //console.dir("reading reviews");
        }
       
        showVideo() {            
            this.setVideo2(this.product.properties["videoFile"]);
            this.$rootScope.$broadcast("AnalyticsEvent", "VideoStarted", null, null, this.product.properties["videoFile"]);
        }

        show360() {
            this.$rootScope.$broadcast("AnalyticsEvent", "Selected360View");

            if (this.product.unspsc.length > 0) {
                var lanes = parseInt(this.product.unspsc.substring(0, 2));
                var frames = parseInt(this.product.unspsc.substring(2));
                this.set360(this.parentErpNumber, lanes, frames);
            }
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

        protected scrollTo(id: string): void {
            this.$location.hash(id);
            this.$anchorScroll();
        }
    }

    angular
        .module("insite")
        .controller("ProductDetailController", NbfProductDetailController);
}