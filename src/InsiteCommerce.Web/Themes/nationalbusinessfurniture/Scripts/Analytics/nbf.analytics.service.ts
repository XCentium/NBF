import ICartService = insite.cart.ICartService;

module nbf.analytics {

    export interface IAnalyticsEventHandler {
        handleAnalyticsEvent(event: AnalyticsEvent, data: AnalyticsDataLayer): void;
    }

    export class AnalyticsService {

        static $inject = ["$window", "$rootScope", "sessionService", "queryString", "ipCookie", "pageAnalyticsService"];

        private _handlers: IAnalyticsEventHandler[] = [];
        private _isInitialCartLoad = true;

        constructor(
            protected $window: ng.IWindowService,
            protected $rootScope: ng.IRootScopeService,
            protected sessionService: insite.account.ISessionService,
            protected queryString: insite.common.IQueryStringService,
            protected ipCookie: any,
            protected pageAnalyticsService: IPageAnalyticsService)
        {
            this.AddHandler(new AdobeAnalytics());
            var self = this;

            $rootScope.$on("AnalyticsEvent", (event, analyticsEvent, navigationUri, analyticsData, data2) => self.handleAnalyticsEvent(event, analyticsEvent, navigationUri, analyticsData, data2));
            $rootScope.$on("AnalyticsCart", (event, cart) => self.handleAnalyticsCart(event, cart));
            $rootScope.$on("AnalyticsPageType", (event, pageType) => self.handlePageTypeEvent(pageType));
            $rootScope.$on("$locationChangeSuccess", (event, newUrl, oldUrl) => setTimeout(() => self.handlePageLoad(event, newUrl, oldUrl), 100));
            $rootScope.$on("$locationChangeStart", () => self.handleNavigationStart());

            $(".live-chat-link").on('click', (event) => {
                self.FireEvent(AnalyticsEvents.TopLiveChatSelected);
            });

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

        private handleAnalyticsEvent(event, analyticsEvent: string, navigationUri, analyticsData, data) {
            switch (analyticsEvent) {
                case AnalyticsEvents.EmailSignUp:
                    this.Data.profile.profileInfo.email = data;
                    break;
                case AnalyticsEvents.ProductPageView:
                    this.setProductData(data.product, data.breadcrumbs);
                    break;
                case AnalyticsEvents.FailedSearch:
                case AnalyticsEvents.SuccessfulSearch:
                    this.setSearchData(data);
                    break;
                case AnalyticsEvents.CheckoutComplete:
                    this.setTransactionData(data.cart, data.cartLines);
                    break;
                case AnalyticsEvents.ProductRemovedFromCart:
                case AnalyticsEvents.ProductAddedToCart:
                case AnalyticsEvents.CartOpened:
                    this.Data.events.push({
                        event: analyticsEvent,
                        data: this.convertCartLine(data)
                    });
                    break;
                case AnalyticsEvents.ShippingBillingInfoComplete:
                    this.Data.profile.profileInfo.state = data.state;
                    this.Data.profile.profileInfo.zip = data.zip;
                    break;
                case AnalyticsEvents.ContentShared:
                case AnalyticsEvents.VideoStarted:
                case AnalyticsEvents.PromoApplied:
                    this.Data.events.push({
                        event: analyticsEvent,
                        data: data
                    });
                    break;
                case AnalyticsEvents.ProductListingFiltered:
                    this.Data.pageInfo.internalSearch.filters = data;
                    break;
                case AnalyticsEvents.ShopTheLook:
                    this.Data.pageInfo.shopTheLook = data;
                    break;
                case AnalyticsEvents.BreadCrumbs:
                    this.Data.pageInfo.breadCrumbs = data;
            }
            console.log("Firing Analytics Event: " + analyticsEvent);
            this.FireEvent(analyticsEvent as AnalyticsEvent);
            if (navigationUri) {
                location.href = navigationUri;
            }
        }

        private handleAnalyticsCart(event, cart: CartModel) {
            this.Data.cart.items = [];
            cart.cartLines.forEach((p) => {
                this.Data.cart.items.push(this.convertCartLine(p));
            });
            this.Data.cart.cartID = cart.id;
            this.Data.cart.price.estimatedTotal = cart.cartLines.length > 0 ? cart.orderGrandTotal : 0;
            this.Data.cart.price.basePrice = cart.orderSubTotalWithOutProductDiscounts;
            this.Data.cart.price.tax = cart.totalTax;
            this.Data.cart.price.totalDiscount = parseFloat(((cart.orderSubTotalWithOutProductDiscounts + cart.shippingAndHandling + cart.totalTax) - this.Data.cart.price.estimatedTotal).toFixed(2));
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
            product.sku = p.erpNumber.split("_")[0];
            product.quantity = p.qtyOrdered;
            product.bulkDiscount = 0;
            product.collection = p.properties['collection'];
            product.category = p.properties['category'];
            product.vendor = p.properties['vendor'];
            return product;
        }

        private handlePageLoad(event, newUrl, oldUrl) {
            this.pageAnalyticsService.getPageAnalytics().then(pageAnalytics => {
                var currentPath = this.removeLeadingAndTrailingSlashes(window.location.pathname);
                var pageType = "", pageName = "", section = "", subsection = "";

                for (var page of pageAnalytics) {
                    if (this.removeLeadingAndTrailingSlashes(page.url) == currentPath) {
                        pageType = page.pageType;
                        pageName = page.pageName;
                        section = page.section;
                        subsection = page.subSection;
                        break;
                    }
                }

                this.Data.events = [];
                this.Data.pageInfo.destinationUrl = newUrl;
                this.Data.pageInfo.referringUrl = oldUrl;
                this.Data.pageInfo.affiliateCode = this.getSiteId();
                this.Data.pageInfo.pageName = pageName;
                this.Data.pageInfo.pageType = pageType;
                this.Data.pageInfo.siteSection = section;
                this.Data.pageInfo.siteSubsection = subsection;

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
            });

        }

        private removeLeadingAndTrailingSlashes(val: string): string {
            if (val && val.length > 0) {
                var retVal = val.trim();
                if (retVal.charAt(0) == '/') {
                    retVal = retVal.slice(1);
                }
                if (retVal.charAt(retVal.length - 1) == '/') {
                    retVal = retVal.slice(0, -1);
                }
                return retVal;
            }
            return "";
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
            this.Data.pageInfo.breadCrumbs = breadcrumbs.map(b => b.text);
        }

        private setTransactionData(cart: CartModel, cartLines: CartLineModel[]) {
            this.Data.transaction.shippingAddress.city = cart.shipTo.city;
            this.Data.transaction.shippingAddress.country = cart.shipTo.country.abbreviation;
            this.Data.transaction.shippingAddress.line1 = cart.shipTo.address1;
            this.Data.transaction.shippingAddress.line2 = cart.shipTo.address2;
            this.Data.transaction.shippingAddress.postalCode = cart.shipTo.postalCode;
            this.Data.transaction.shippingAddress.stateProvince = cart.shipTo.state.abbreviation
            this.Data.transaction.billingAddress.city = cart.billTo.city;
            this.Data.transaction.billingAddress.country = cart.billTo.country.abbreviation;
            this.Data.transaction.billingAddress.line1 = cart.billTo.address1;
            this.Data.transaction.billingAddress.line2 = cart.billTo.address2;
            this.Data.transaction.billingAddress.postalCode = cart.billTo.postalCode;
            this.Data.transaction.billingAddress.stateProvince = cart.billTo.state.abbreviation
            this.Data.transaction.total.transactionTotal = cart.orderGrandTotal;
            this.Data.transaction.total.promoDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
            this.Data.transaction.total.tax = cart.totalTax;
            this.Data.transaction.total.shipping = cart.shippingAndHandling;
            this.Data.transaction.total.basePrice = cart.orderSubTotal;
            this.Data.transaction.total.bulkDiscount = 0;
            this.Data.transaction.total.promoCode = "";
            this.Data.transaction.paymentMethod = cart.paymentMethod ? cart.paymentMethod.name : "Open Credit";
            this.Data.transaction.shippingMethod = cart.shipVia.description;
            this.Data.transaction.transactionId = cart.orderNumber;
            cartLines.forEach(line => {
                this.Data.transaction.products.push(this.convertCartLine(line));
            });
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

        private getSiteId(): string {
            var cookie = this.ipCookie("CampaignID");
            if (cookie) {
                return cookie;
            }

            var siteId = "default_web";

            const siteIdQueryString = this.queryString.get("SiteID");
            const ganTrackingId = this.queryString.get("GanTrackingID");
            const affiliateSiteId = this.queryString.get("affiliateSiteID");
            const affId = this.queryString.get("affid");
            const origin = this.queryString.get("Origin");
            const ref = this.queryString.get("Ref");

            if (siteIdQueryString) {
                siteId = siteIdQueryString;
            } else if (ganTrackingId) {
                siteId = `gan_${ganTrackingId}`;
            } else if (affiliateSiteId) {
                siteId = affiliateSiteId;
            } else if (affId) {
                siteId = affId;
            } else if (origin) {
                siteId = origin;
            } else if (ref) {
                siteId = ref;
            } else {
                var searchEngineList = this.getSearchEngineDomains();
                var referrer = document.referrer;
                for (var se in searchEngineList) {
                    if (referrer.indexOf(se) > -1) {
                        siteId = searchEngineList[se];
                        break;
                    }
                }
            }

            var expire = new Date();
            expire.setDate(expire.getDate() + 90);
            this.ipCookie("CampaignID", siteId, { path: "/", expires: expire });

            return siteId;
        }

        private getSearchEngineDomains() {
            //This value should eventually come from the application dictionary (or something) and not be hardcored. 
            var searchEngines = "google.:glo_nbf,msn.:mso_nbf,bing.:mso_nbf,yahoo.:yho_nbf,aol.:aol_nbf,facebook.:fb_NBF_Social,instagram.:ig_NBF_Social,pinterest.:pin_NBF_Social,linkedin.:lin_NBF_Social,youtube.:yt_NBF_Social,ask.,about.,baidu.,yandex.,search.,duckduckgo.,localhost:loco_nbf";
            var domainList = {};
            searchEngines.split(",").forEach(se => {
                var tokens = se.split(":", 2).filter(t => t && t.trim() != "");
                var trackingCode = tokens.length > 1 ? tokens[1] : "Organic";
                domainList[tokens[0]] = trackingCode;
            });
            return domainList;
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
        AddProductToWishList: "AddProductToWishList" as AnalyticsEvent,
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
        ProductListingFiltered: "ProductListingFiltered" as AnalyticsEvent,
        CheckoutComplete: "CheckoutComplete" as AnalyticsEvent,
        ShopTheLook: "ShopTheLook" as AnalyticsEvent,
        VideoStarted: "VideoStarted" as AnalyticsEvent,
        CartView: "CartView" as AnalyticsEvent,
        PromoApplied: "PromoApplied" as AnalyticsEvent,
        BreadCrumbs: "BreadCrumbs" as AnalyticsEvent,
        BlogComment: "BlogComment" as AnalyticsEvent,
        TopLiveChatSelected: "TopLiveChatSelected" as AnalyticsEvent
    }

    export type AnalyticsEvent = "PageLoad" | "ProductPageView" | "SwatchRequest" | "CatalogRequest" | "QuoteRequest" | "MiniCartQuoteRequest" | "InternalSearch" | "SuccessfulSearch" |
        "FailedSearch" | "ContactUsInitiated" | "ContactUsCompleted" | "AccountCreation" | "CheckoutAccountCreation" | "Login" | "CrossSellSelected" | "EmailSignUp" | "LiveChatStarted" |
        "ProductAddedToCart" | "CheckoutInitiated" | "CheckoutComplete" | "ProductQuestionStarted" | "ProductQuestionAsked" | "Selected360View" | "AddProductToWishList" | "SaveOrderFromCartPage" |
        "ReadReviewsSelected" | "MiniCartHover" | "SaveCart" | "CartOpened" | "ProductRemovedFromCart" | "ShippingBillingInfoComplete" | "ShippingMethodSelected" | "BillingMethodSelected" |
        "ContinueShoppingFromCartPage" | "ContentShared" | "ProductListingFiltered" | "ShopTheLook" | "VideoStarted" | "CartView" | "PromoApplied" | "BreadCrumbs" | "BlogComment" | "TopLiveChatSelected";

}