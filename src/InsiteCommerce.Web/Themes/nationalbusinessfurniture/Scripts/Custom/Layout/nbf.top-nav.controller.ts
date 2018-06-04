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
        
        static $inject = ["$scope", "$window", "$attrs", "sessionService", "websiteService", "coreService", "$rootScope"];

        constructor(
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected $attrs: ITopNavControllerAttributes,
            protected sessionService: account.ISessionService,
            protected websiteService: websites.IWebsiteService,
            protected coreService: core.ICoreService,
            protected $rootScope: ng.IRootScopeService
        ) {
            this.init();
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

            // click events for live-expert 
            $(document).on('click', '.live-chat-link', function () {
                self.$rootScope.$broadcast("AnalyticsEvent", "LiveChartStarted");
                self.setLiveExpertsWidget();
            });
            // live-expert
            
            $(".head-row .cart-button").hover(function () {
                $(this).unbind('mouseenter mouseleave')
                
                self.$rootScope.$broadcast("AnalyticsEvent", "MiniCartHover");
            });

            $(document).on('click', '.share-links a', (event) => {
                let target = $(event.target);
                if (target.hasClass("fa-envelope")) {
                    self.$rootScope.$broadcast("AnalyticsEvent", "ContentShared", null, null, "Email");
                } else if (target.hasClass("fa-twitter")) {
                    self.$rootScope.$broadcast("AnalyticsEvent", "ContentShared", null, null, "Twitter");
                } else if (target.hasClass("fa-facebook")) {
                    self.$rootScope.$broadcast("AnalyticsEvent", "ContentShared", null, null, "Facebook");
                } else if (target.find(".fa-pinterest-p").length > 0) {
                    self.$rootScope.$broadcast("AnalyticsEvent", "ContentShared", null, null, "Pinterest");
                } else if (target.find(".ico-printer-with-paper").length > 0) {
                    self.$rootScope.$broadcast("AnalyticsEvent", "ContentShared", null, null, "Printed");
                }
            });

            this.$rootScope.$on("productPageLoaded", (event, product) => {
                this.product = product;
            });

            this.$scope.$watch(() => this.getBreadCrumbsString(), (newVal, oldVal, scope) => {
                if (newVal.length > 0) {
                    scope.$root.$broadcast("AnalyticsEvent", "BreadCrumbs", null, null, newVal);
                }
            });
        }

        private getBreadCrumbsString(): string {
            var bcElements = angular.element(".breadcrumbs");
            if (bcElements.length > 0) {
                var bcString = "";
                var breadcrumbs = bcElements.first().find("li");
                breadcrumbs.children("a").each((index, elem) => {
                    bcString += elem.textContent.trim() + ",";
                });
                bcString += breadcrumbs.last().text().trim();
                return bcString;
            }
            return "";
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
                    callTypeID: 4, // //4=text chat 1=video 2=voice null=select option
                    categoryID: 122
                };

                if (self.product) {
                    let liveProductDemoAttr = self.getAttributeValue(self.product, "Live Product Demo");
                    if (liveProductDemoAttr != null && liveProductDemoAttr == "Yes"
                        && self.product.modelNumber != null
                    ) {
                        var catId = parseInt(self.product.modelNumber);
                        if (catId) {
                            liveExpertConfig.categoryID = catId;
                            liveExpertConfig.callTypeID = null;
                        }

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