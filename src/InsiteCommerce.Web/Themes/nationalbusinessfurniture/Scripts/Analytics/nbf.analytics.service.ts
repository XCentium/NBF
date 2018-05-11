import ICartService = insite.cart.ICartService;

module nbf.analytics {

    export interface IAnalyticsEventHandler {
        handleAnalyticsEvent(event: AnalyticsEvent, data: AnalyticsDataLayer): void;
    }

    export class AnalyticsService {

        static $inject = ["$window", "$rootScope", "sessionService"];

        private _handlers: IAnalyticsEventHandler[] = [];

        constructor(protected $window: ng.IWindowService, protected $rootScope: ng.IRootScopeService, protected sessionService: insite.account.ISessionService) {
            this.AddHandler(new AdobeAnalytics());

            var self = this;

            $rootScope.$on("AnalyticsEvent", (event, analyticsEvent, navigationUri, analyticsData, data2) => self.handleAnalyticsEvent(event, analyticsEvent, navigationUri, analyticsData, data2));
            $rootScope.$on("AnalyticsCart", (event, cart) => self.handleAnalyticsCart(event, cart));
            $rootScope.$on("$locationChangeSuccess", (event) => setTimeout(() => self.handlePageLoad(event), 1000));
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
                default:
                    console.log("Invalid analytics event: " + analyticsEvent);
                    break;
            }
            this.FireEvent(analyticsEvent as AnalyticsEvent);
            if (navigationUri) {
                location.href = navigationUri;
            }
        }

        private handleAnalyticsCart(event, cart: CartModel) {
            this.Data.cart.items = [];
            cart.cartLines.forEach((p) => {
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
                product.vendor = p.manufacturerItem;
                product.quantity = p.qtyOrdered;
                // need to fill these out
                product.category = '';
                product.collection = '';
                product.bulkDiscount = 0;
                this.Data.cart.items.push(product);
            });
            this.Data.cart.cartID = cart.id;
            this.Data.cart.price.estimatedTotal = cart.orderGrandTotal;
            this.Data.cart.price.basePrice = cart.orderSubTotalWithOutProductDiscounts;
            this.Data.cart.price.tax = cart.totalTax;
            this.Data.cart.price.totalDiscount = parseFloat(((cart.orderSubTotalWithOutProductDiscounts + cart.shippingAndHandling) - cart.orderGrandTotal).toFixed(2));
            this.Data.cart.price.estimatedShipping = cart.shippingAndHandling;
            this.Data.cart.price.bulkDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
            this.Data.cart.price.promoDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
        }

        private handlePageLoad(event) {
            this.Data.pageInfo.destinationUrl = window.location.href;
            this.Data.pageInfo.referringUrl = this.$window.document.referrer;
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
        SaveCart: "SaveCart" as AnalyticsEvent        
    }

    export type AnalyticsEvent = "PageLoad" | "ProductPageView" | "SwatchRequest" | "CatalogRequest" | "QuoteRequest" | "MiniCartQuoteRequest" | "InternalSearch" | "SuccessfulSearch" | 
        "FailedSearch" | "ContactUsInitiated" | "ContactUsCompleted" | "AccountCreation" | "CheckoutAccountCreation" | "Login" | "CrossSellSelected" | "EmailSignUp" | "LiveChatStarted" |
        "ProductAddedToCart" | "CheckoutInitiated" | "ProductQuestionAsked" | "Selected360View" | "AddProductToWishlist" | "SaveOrderFromCartPage" | "ContinueShoppingFromCartPage" |
        "ReadReviewsSelected" | "MiniCartHover" | "SaveCart";

}