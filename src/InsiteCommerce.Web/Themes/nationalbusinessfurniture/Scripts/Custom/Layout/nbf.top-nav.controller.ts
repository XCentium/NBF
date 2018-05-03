module insite.layout {
    "use strict";

    //Cannot extend TopNavController for some reason, create new controller
    export class NbfTopNavController{
        showTopMessage: boolean = true;
        languages: any[];
        currencies: any[];
        session: any;
        dashboardUrl: string;
        product: ProductDto = null;
        
        static $inject = ["$scope", "$window", "$attrs", "sessionService", "websiteService", "coreService", "analyticsService", "$rootScope"];

        constructor(
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected $attrs: ITopNavControllerAttributes,
            protected sessionService: account.ISessionService,
            protected websiteService: websites.IWebsiteService,
            protected coreService: core.ICoreService,
            protected analyticsService: nbf.analytics.AnalyticsService,
            protected $rootScope: ng.IRootScopeService
        ) {
            this.init();
        }

        protected getPageData(): void {

            var data = this.analyticsService.Data;
            data.pageInfo.destinationUrl = window.location.href;
            data.pageInfo.referringUrl = this.$window.document.referrer;
            if (this.session) {
                data.profile.isAuthenticated = this.session.isAuthenticated;
                if (data.profile.isAuthenticated == true) {
                    data.profile.profileInfo.email = this.session.email;
                    data.profile.profileInfo.profileId = this.session.userName;
                }
            }
            this.analyticsService.Data = data;
            console.dir(data);
        }

        init(): void {
            var self = this;
            this.dashboardUrl = this.$attrs.dashboardUrl;
            // TODO ISC-4406
            // TODO ISC-2937 SPA kill all of the things that depend on broadcast for session and convert them to this, assuming we can properly cache this call
            // otherwise determine some method for a child to say "I expect my parent to have a session, and I want to use it" broadcast will not work for that
            this.getSession();

            this.$scope.$on("sessionUpdated", (event, session) => {
                this.onSessionUpdated(session);
            });
            var dataLayer = new nbf.analytics.AnalyticsDataLayer();
            this.analyticsService.Data = dataLayer;

            this.$scope.$on("setAnalyticsCart", (event, cart) => {
                this.setCartData(cart);
            });

            // click events for live-expert 
            $(document).on('click', '.live-chat-link', function () {
                
                self.initAnalyticsEvent("LiveChatStarted", null, null, null);
                self.setLiveExpertsWidget();
            });
            // live-expert
            
            $(".pr-submit").click(function () {
                self.$rootScope.$broadcast("initAnalyticsEvent", "ProductQuestionAsked");
            });

            $(".head-row .cart-button").hover(function () {
                $(this).unbind('mouseenter mouseleave')
                
                self.$rootScope.$broadcast("initAnalyticsEvent", "MiniCartHover");
            });
            this.$rootScope.$on("productPageLoaded", (event, product) => {
                this.product = product;
            });
            
            this.$rootScope.$on("initAnalyticsEvent", (event, analyticsEvent, navigationUri, analyticsData, data2) => {
                this.initAnalyticsEvent(analyticsEvent, navigationUri, analyticsData, data2);
            });

            this.$scope.$on("$locationChangeSuccess", (event, session) => {
                setTimeout(function () {
                    self.$scope.$broadcast("initAnalyticsEvent", "PageLoad", null, self.analyticsService.Data);
                }, 1000);
            });
        }

        initAnalyticsEvent(analyticsEvent, navigationUri, analyticsData, data2) {
            if (analyticsData) {
                this.analyticsService.Data = analyticsData;
            }
            console.log("getPageData()");
            this.getPageData();
            if (analyticsEvent == "EmailSignUp") {
                this.analyticsService.Data.profile.profileInfo.email = data2;
            }

            if (analyticsEvent == "ProductPageView") {
                this.setProductData(data2);
            }

            if (analyticsEvent == "FailedSearch" || analyticsEvent == "SuccessfulSearch") {
                this.setSearchData(data2);
            }

            this.analyticsService.FireEvent(analyticsEvent);
            window.console.log("firing " + analyticsEvent);
            window.console.dir(this.analyticsService.Data);
            if (navigationUri) {
                location.href = navigationUri;
            }
        }

        setSearchData(search: nbf.analytics.AnalyticsPageSearchInfo): void {
            var internalSearch = new nbf.analytics.AnalyticsPageSearchInfo();
            internalSearch.searchResults = search.searchResults;
            internalSearch.searchTerm = search.searchTerm;
            this.analyticsService.Data.pageInfo.internalSearch = internalSearch;
        }

        protected getAttributeValue(product: ProductDto, attrName: string): string {
            let retVal: string = '';

            if (product && product.attributeTypes) {
                var attrType = product.attributeTypes.find(x => x.name == attrName && x.isActive == true);

                if (attrType && attrType.attributeValues && attrType.attributeValues.length > 0) {
                    retVal = attrType.attributeValues[0].valueDisplay;
                }
            }

            return retVal;
        }
        setProductData(product: ProductDto): void {

            this.analyticsService.Data.product.productInfo.basePrice = product.basicListPrice;
            this.analyticsService.Data.product.productInfo.productImage = product.smallImagePath;
            this.analyticsService.Data.product.productInfo.productName = product.name;
            this.analyticsService.Data.product.productInfo.salePrice = product.basicSalePrice;
            this.analyticsService.Data.product.productInfo.sku = product.erpNumber;
            this.analyticsService.Data.product.productInfo.vendor = product.vendorNumber;
            this.analyticsService.Data.product.productInfo.collection = this.getAttributeValue(product, "Collection");
            this.analyticsService.Data.product.productInfo.category = '';
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
                    this.analyticsService.Data.product.relatedProductsInfo.push(relatedProduct);
                });
            }
        }

        setCartData(cart: CartModel): void {
            
            var product = new nbf.analytics.AnalyticsCartItem();
            this.analyticsService.Data.cart.items = [];
            cart.cartLines.forEach((p) => {
                product.description = p.shortDescription;

                product.finalPrice = p.pricing.extendedActualPrice;
                product.productImage = p.smallImagePath;
                product.basePrice = p.pricing.regularPrice;
                product.productName = p.productName;
                if (p.isDiscounted) {
                    product.promoDiscount = p.pricing.regularPrice - p.pricing.actualPrice;
                    product.totalDiscount = p.pricing.regularPrice - p.pricing.actualPrice;
                }
                product.sku = p.erpNumber;
                product.vendor = p.manufacturerItem;
                // need to fill these out
                product.category = '';
                product.collection = '';
                product.bulkDiscount = 0;
                this.analyticsService.Data.cart.items.push(product);
            });
            this.analyticsService.Data.cart.cartID = cart.id;
            this.analyticsService.Data.cart.price.estimatedTotal = cart.orderGrandTotal;
            this.analyticsService.Data.cart.price.basePrice = cart.orderSubTotalWithOutProductDiscounts;
            this.analyticsService.Data.cart.price.tax = cart.totalTax;
            this.analyticsService.Data.cart.price.totalDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
            this.analyticsService.Data.cart.price.estimatedShipping = cart.shippingAndHandling;
            this.analyticsService.Data.cart.price.bulkDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
            this.analyticsService.Data.cart.price.promoDiscount = cart.orderSubTotalWithOutProductDiscounts - cart.orderSubTotal;
        }

        protected onSessionUpdated(session: SessionModel): void {
            this.session = session;
        }

        protected getSession(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
            this.getWebsite("languages,currencies");

        }

        protected getSessionFailed(error: any): void {
        }

        protected getWebsite(expand: string): void {
            this.websiteService.getWebsite(expand).then(
                (website: WebsiteModel) => { this.getWebsiteCompleted(website); },
                (error: any) => { this.getWebsitedFailed(error); });
        }

        protected getWebsiteCompleted(website: WebsiteModel): void {
            this.languages = website.languages.languages.filter(l => l.isLive);
            this.currencies = website.currencies.currencies;

            this.checkCurrentPageForMessages();

            angular.forEach(this.languages, (language: any) => {
                if (language.id === this.session.language.id) {
                    this.session.language = language;
                }
            });

            angular.forEach(this.currencies, (currency: any) => {
                if (currency.id === this.session.currency.id) {
                    this.session.currency = currency;
                }
            });
        }

        protected getWebsitedFailed(error: any): void {
        }

        setLanguage(languageId: string): void {
            languageId = languageId ? languageId : this.session.language.id;

            this.sessionService.setLanguage(languageId).then(
                (session: SessionModel) => { this.setLanguageCompleted(session); },
                (error: any) => { this.setLanguageFailed(error); });
        }

        protected setLanguageCompleted(session: SessionModel): void {
            if (this.$window.location.href.indexOf("AutoSwitchContext") === -1) {
                if (this.$window.location.href.indexOf("?") === -1) {
                    this.$window.location.href = `${this.$window.location.href}?AutoSwitchContext=false`;
                } else {
                    this.$window.location.href = `${this.$window.location.href}&AutoSwitchContext=false`;
                }
            } else {
                this.$window.location.reload();
            }
        }

        protected setLanguageFailed(error: any): void {
        }

        setCurrency(currencyId: string): void {
            currencyId = currencyId ? currencyId : this.session.currency.id;

            this.sessionService.setCurrency(currencyId).then(
                (session: SessionModel) => { this.setCurrencyCompleted(session); },
                (error: any) => { this.setCurrencyFailed(error); });
        }

        protected setCurrencyCompleted(session: SessionModel): void {
            this.$window.location.reload();
        }

        protected setCurrencyFailed(error: any): void {
        }

        signOut(returnUrl: string): void {
            this.sessionService.signOut().then(
                (signOutResult: string) => { this.signOutCompleted(signOutResult, returnUrl); },
                (error: any) => { this.signOutFailed(error); });
        }

        protected signOutCompleted(signOutResult: string, returnUrl: string): void {
            this.$window.location.href = returnUrl;
        }

        protected signOutFailed(error: any): void {
        }

        protected checkCurrentPageForMessages(): void {
            const currentUrl = this.coreService.getCurrentPath();
            const index = currentUrl.indexOf(this.dashboardUrl.toLowerCase());
            const show = index === -1 || (index + this.dashboardUrl.length !== currentUrl.length);

            if (!show && this.session.hasRfqUpdates) {
                this.closeQuoteInformation();
            }
        }

        protected closeQuoteInformation(): void {
            this.session.hasRfqUpdates = false;

            const session = <SessionModel>{};
            session.hasRfqUpdates = false;

            this.updateSession(session);
        }

        protected updateSession(session: SessionModel): void {
            this.sessionService.updateSession(session).then(
                (sessionResult: SessionModel) => { this.updateSessionCompleted(sessionResult); },
                (error: any) => { this.updateSessionFailed(error); });
        }

        protected updateSessionCompleted(session: SessionModel): void {
        }

        protected updateSessionFailed(error: any): void {
        }
        
        protected setLiveExpertsWidget() {
            var self = this;
            setTimeout(function () {
                var liveExpertConfig = {
                    enterpriseURL: 'liveexpert.net',
                    sourceHost: 'assets.liveexpert.net',
                    assetLocation: 'nbf/hidden-widget/nbf',
                    widgetViewDelegate: 'hiddenWidgetViewDelegate',
                    apiURL: 'api.liveexpert.net',
                    companyID: 31,
                    language: 'EN',
                    //callTypeID: 4, // //4=text chat 1=video 2=voice null=select option
                    categoryID: 122
                };

                if (self.product) {
                    let liveProductDemoAttr = self.getAttributeValue(self.product, "Live Product Demo");
                    if (liveProductDemoAttr != null && liveProductDemoAttr == "Yes"
                        && self.product.modelNumber != null
                    ) {
                        var catId = parseInt(self.product.modelNumber);
                        if (catId) { liveExpertConfig.categoryID = catId; }

                    }
                }
                //liveExpertConfig.callTypeID = 4;  //text chat 1=video 2=voice 
                let liveexpert = self.$window["liveexpert"];
                liveexpert.LEAWidget.init(liveExpertConfig);
                
                liveexpert.startCall();
            }, 2000);
        }

        closeTopMessage(): void {
            this.showTopMessage = false;
        }
    }

    angular
        .module("insite")
        .controller("NbfTopNavController", NbfTopNavController);
}