import ICartService = insite.cart.ICartService;

module nbf.analytics {

    export interface IAnalyticsEventHandler {
        handleAnalyticsEvent(event: AnalyticsEvent, data: AnalyticsDataLayer): void;
    }

    export class AnalyticsService {

        static $inject = ["$window", "$rootScope", "sessionService"];

        private _handlers: IAnalyticsEventHandler[] = [];
        private _isInitialCartLoad = true;

        constructor(protected $window: ng.IWindowService, protected $rootScope: ng.IRootScopeService, protected sessionService: insite.account.ISessionService) {
            this.AddHandler(new AdobeAnalytics());

            var self = this;

            $rootScope.$on("AnalyticsEvent", (event, analyticsEvent, navigationUri, analyticsData, data2) => self.handleAnalyticsEvent(event, analyticsEvent, navigationUri, analyticsData, data2));
            $rootScope.$on("AnalyticsCart", (event, cart) => self.handleAnalyticsCart(event, cart));
            $rootScope.$on("AnalyticsPageType", (event, pageType) => self.handlePageTypeEvent(pageType));
            $rootScope.$on("$locationChangeSuccess", (event, newUrl, oldUrl) => setTimeout(() => self.handlePageLoad(event, newUrl, oldUrl), 100));
            $rootScope.$on("$locationChangeStart", () => self.handleNavigationStart());

        }

        get Data(): AnalyticsDataLayer {
            if (!this.$window["digitalData"]) {
                this.$window["digitalData"] = new AnalyticsDataLayer();
            }
            return this.$window["digitalData"];
        }
        set Data(dataLayer: AnalyticsDataLayer) {
            this.$window["digitalData"] = dataLayer;
        }

        public AddHandler(handler: IAnalyticsEventHandler) {
            this._handlers.push(handler);
        }

        public RemoveHandler(handler: IAnalyticsEventHandler) {
            this._handlers = this._handlers.filter(h => h !== handler);
        }

        public FireEvent(event: AnalyticsEvent) {
            if (!event) {
                return;
            }
            for (var handler of this._handlers) {
                handler.handleAnalyticsEvent(event, this.Data);
            }
        }

        private handleAnalyticsEvent(event, analyticsEvent: string, navigationUri, analyticsData, data2) {
            switch (analyticsEvent) {
                case AnalyticsEvents.EmailSignUp:
                    this.Data.profile.profileInfo.email = data2;
                    break;
                case AnalyticsEvents.ProductPageView:
                    this.setProductData(data2.product, data2.breadcrumbs);
                    break;
                case AnalyticsEvents.FailedSearch, AnalyticsEvents.SuccessfulSearch:
                    this.setSearchData(data2);
            }
            console.log("Firing Analytics Event: " + analyticsEvent);
            this.FireEvent(analyticsEvent as AnalyticsEvent);
            if (navigationUri) {
                location.href = navigationUri;
            }
        }

        private handleAnalyticsCart(event, cart: CartModel) {
            if (this._isInitialCartLoad) {
                this._isInitialCartLoad = false;
            } else {
                //Checking if cart was opened
                if (this.Data.cart.items.length == 0 && cart.cartLines.length > 0) {
                    this.Data.events.push({
                        event: AnalyticsEvents.CartOpened,
                        data: this.convertCartLine(cart.cartLines[0])
                    });
                    this.FireEvent(AnalyticsEvents.CartOpened);
                }

                //Checking if a product was removed
                if (this.Data.cart.items.length > cart.cartLines.length) {
                    this.Data.cart.items.forEach(item => {
                        if (!cart.cartLines.find((cl: CartLineModel) => item.sku === cl.erpNumber)) {
                            this.Data.events.push({
                                event: AnalyticsEvents.ProductRemovedFromCart,
                                data: item
                            });
                        }
                    });
                    this.FireEvent(AnalyticsEvents.ProductRemovedFromCart);
                }

                //Checking if a product was added
                if (this.Data.cart.items.length < cart.cartLines.length) {
                    cart.cartLines.forEach(cl => {
                        if (!this.Data.cart.items.find((item: AnalyticsCartItem) => item.sku === cl.erpNumber)) {
                            this.Data.events.push({
                                event: AnalyticsEvents.ProductAddedToCart,
                                data: this.convertCartLine(cl)
                            });
                        }
                    });
                    this.FireEvent(AnalyticsEvents.ProductAddedToCart);
                }
            }

            this.Data.cart.items = [];
            cart.cartLines.forEach((p) => {
                this.Data.cart.items.push(this.convertCartLine(p));
            });
            this.Data.cart.cartID = cart.id;
            this.Data.cart.price.estimatedTotal = cart.cartLines.length > 0 ? cart.orderGrandTotal : 0;
            this.Data.cart.price.basePrice = cart.orderSubTotalWithOutProductDiscounts;
            this.Data.cart.price.tax = cart.totalTax;
            this.Data.cart.price.totalDiscount = parseFloat(((cart.orderSubTotalWithOutProductDiscounts + cart.shippingAndHandling) - this.Data.cart.price.estimatedTotal).toFixed(2));
            this.Data.cart.price.estimatedShipping = cart.shippingAndHandling;
            this.Data.cart.price.bulkDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
            this.Data.cart.price.promoDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
        }

        private convertCartLine(p: CartLineModel): AnalyticsCartItem {
            var product = new nbf.analytics.AnalyticsCartItem();
            product.productName = p.shortDescription;
            product.finalPrice = p.pricing.extendedActualPrice;
            product.productImage = p.smallImagePath;
            product.basePrice = p.pricing.regularPrice;
            if (p.isDiscounted) {
                product.promoDiscount = p.pricing.regularPrice - p.pricing.actualPrice;
                product.totalDiscount = p.pricing.regularPrice - p.pricing.actualPrice;
            }
            product.sku = p.erpNumber;
            product.quantity = p.qtyOrdered;
            product.bulkDiscount = 0;
            product.collection = p.properties['Collection'];
            product.category = p.properties['Category'];
            product.vendor = p.properties['Vendor'];
            return product;
        }

        private handlePageLoad(event, newUrl, oldUrl) {
            this.Data.events = [];
            this.Data.pageInfo.destinationUrl = newUrl;
            this.Data.pageInfo.referringUrl = oldUrl;
            this.sessionService.getSession()
                .then(session => {
                    if (session) {
                        this.Data.profile.isAuthenticated = session.isAuthenticated && !session.isGuest;
                        if (this.Data.profile.isAuthenticated == true) {
                            this.Data.profile.profileInfo.email = session.email;
                            this.Data.profile.profileInfo.profileId = session.userName;
                        }
                    }
                })
                .catch(error => {
                    console.log("Failed to get sesion: " + error);
                })
                .finally(() => {
                    this.FireEvent(AnalyticsEvents.PageLoad);
                });

        }

        private setProductData(product: ProductDto, breadcrumbs: BreadCrumbModel[]) {
            var category = "";
            if (breadcrumbs && breadcrumbs.length > 0) {
                category = breadcrumbs[0].text;;
                if (category.toLowerCase() == "home" && breadcrumbs.length > 1) {
                    category = breadcrumbs[1].text;
                }
            }
            if (product.pricing.isOnSale) {
                this.Data.product.productInfo.salePrice = product.pricing.actualPrice;
                this.Data.product.productInfo.basePrice = product.pricing.regularPrice;
            } else {
                this.Data.product.productInfo.basePrice = product.pricing.actualPrice;
            }
            this.Data.product.productInfo.productImage = product.smallImagePath;
            this.Data.product.productInfo.productName = product.erpDescription;
            this.Data.product.productInfo.salePrice = product.basicSalePrice;
            this.Data.product.productInfo.sku = product.erpNumber;
            this.Data.product.productInfo.vendor = product.vendorNumber;
            this.Data.product.productInfo.collection = this.getAttributeValue(product, "Collection");
            this.Data.product.productInfo.category = category;
            if (product.relatedProducts.length > 0) {
                product.relatedProducts.forEach((rp) => {
                    var relatedProduct = new nbf.analytics.AnalyticsProductInfo();
                    relatedProduct.basePrice = rp.productDto.basicListPrice;
                    relatedProduct.productImage = rp.productDto.smallImagePath;
                    relatedProduct.productName = rp.productDto.name;
                    relatedProduct.salePrice = rp.productDto.basicSalePrice;
                    relatedProduct.sku = rp.productDto.erpNumber;
                    relatedProduct.vendor = rp.productDto.vendorNumber;
                    relatedProduct.collection = '';
                    relatedProduct.category = '';
                    this.Data.product.relatedProductsInfo.push(relatedProduct);
                });
            }
            this.Data.pageInfo.pageType = "Product Detail Page";
        }

        private getAttributeValue(product: ProductDto, attrName: string): string {
            let retVal: string = '';

            if (product && product.attributeTypes) {
                var attrType = product.attributeTypes.find(x => x.name == attrName && x.isActive == true);

                if (attrType && attrType.attributeValues && attrType.attributeValues.length > 0) {
                    retVal = attrType.attributeValues[0].valueDisplay;
                }
            }

            return retVal;
        }

        private setSearchData(search: nbf.analytics.AnalyticsPageSearchInfo): void {
            var internalSearch = new nbf.analytics.AnalyticsPageSearchInfo();
            internalSearch.searchResults = search.searchResults;
            internalSearch.searchTerm = search.searchTerm;
            this.Data.pageInfo.internalSearch = internalSearch;
        }

        private handlePageTypeEvent(pageType: string) {
            this.Data.pageInfo.pageType = pageType;
        }

        private handleNavigationStart() {
            this.Data.pageInfo.pageType = ""
            this.Data.product = new AnalyticsProduct();
        }

    }
    angular
        .module("insite")
        .service("analyticsService", AnalyticsService)
        .run(["analyticsService", function (analyticsService) {
            //This allows the service to be instantiated without being injected anywhere.
            console.log("Analytics Service initialized.");
        }]);



    //Should be an enum, but the version of typescript available is archaic.. 
    export const AnalyticsEvents = {
        PageLoad: "PageLoad" as AnalyticsEvent,
        ProductPageView: "ProductPageView" as AnalyticsEvent,
        SwatchRequest: "SwatchRequest" as AnalyticsEvent,
        CatalogRequest: "CatalogRequest" as AnalyticsEvent,
        QuoteRequest: "QuoteRequest" as AnalyticsEvent,
        MiniCartQuoteRequest: "MiniCartQuoteRequest" as AnalyticsEvent,
        InternalSearch: "InternalSearch" as AnalyticsEvent,
        SuccessfulSearch: "SuccessfulSearch" as AnalyticsEvent,
        FailedSearch: "FailedSearch" as AnalyticsEvent,
        ContactUsInitiated: "ContactUsInitiated" as AnalyticsEvent,
        ContactUsCompleted: "ContactUsCompleted" as AnalyticsEvent,
        AccountCreation: "AccountCreation" as AnalyticsEvent,
        CheckoutAccountCreation: "CheckoutAccountCreation" as AnalyticsEvent,
        Login: "Login" as AnalyticsEvent,
        CrossSellSelected: "CrossSellSelected" as AnalyticsEvent,
        EmailSignUp: "EmailSignUp" as AnalyticsEvent,
        LiveChatStarted: "LiveChatStarted" as AnalyticsEvent,
        ProductAddedToCart: "ProductAddedToCart" as AnalyticsEvent,
        CheckoutInitiated: "CheckoutInitiated" as AnalyticsEvent,
        Selected360View: "Selected360View" as AnalyticsEvent,
        AddProductToWishlist: "AddProductToWishlist" as AnalyticsEvent,
        SaveOrderFromCartPage: "SaveOrderFromCartPage" as AnalyticsEvent,
        ContinueShoppingFromCartPage: "ContinueShoppingFromCartPage" as AnalyticsEvent,
        ReadReviewsSelected: "ReadReviewsSelected" as AnalyticsEvent,
        MiniCartHover: "MiniCartHover" as AnalyticsEvent,
        SaveCart: "SaveCart" as AnalyticsEvent,
        CartOpened: "CartOpened" as AnalyticsEvent,
        ProductRemovedFromCart: "ProductRemovedFromCart" as AnalyticsEvent,
        ShippingBillingInfoComplete: "ShippingBillingInfoComplete" as AnalyticsEvent,
        ShippingMethodSelected: "ShippingMethodSelected" as AnalyticsEvent,
        BillingMethodSelected: "BillingMethodSelected" as AnalyticsEvent,
        ProductQuestionAsked: "ProductQuestionAsked" as AnalyticsEvent,
        ProductQuestionStarted: "ProductQuestionStarted" as AnalyticsEvent,
        ContentShared: "ContentShared" as AnalyticsEvent,
        ProductListingFiltered: "ProductListingFiltered" as AnalyticsEvent
    }

    export type AnalyticsEvent = "PageLoad" | "ProductPageView" | "SwatchRequest" | "CatalogRequest" | "QuoteRequest" | "MiniCartQuoteRequest" | "InternalSearch" | "SuccessfulSearch" |
        "FailedSearch" | "ContactUsInitiated" | "ContactUsCompleted" | "AccountCreation" | "CheckoutAccountCreation" | "Login" | "CrossSellSelected" | "EmailSignUp" | "LiveChatStarted" |
        "ProductAddedToCart" | "CheckoutInitiated" | "ProductQuestionStarted" | "ProductQuestionAsked" | "Selected360View" | "AddProductToWishlist" | "SaveOrderFromCartPage" |
        "ReadReviewsSelected" | "MiniCartHover" | "SaveCart" | "CartOpened" | "ProductRemovedFromCart" | "ShippingBillingInfoComplete" | "ShippingMethodSelected" | "BillingMethodSelected" |
        "ContinueShoppingFromCartPage" | "ContentShared" | "ProductListingFiltered";

}