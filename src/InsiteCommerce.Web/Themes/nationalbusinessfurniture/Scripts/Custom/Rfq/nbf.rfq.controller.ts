module nbf.rfq {
    "use strict";

    export class NbfRfqController extends insite.rfq.RfqController{
        static $inject = ["coreService", "$scope", "cartService", "rfqService", "accountService", "sessionService", "settingsService", "$q"];

        constructor(
            protected coreService: insite.core.ICoreService,
            protected $scope: ng.IScope,
            protected cartService: insite.cart.ICartService,
            protected rfqService: insite.rfq.IRfqService,
            protected accountService: insite.account.IAccountService,
            protected sessionService: insite.account.ISessionService,
            protected settingsService: insite.core.ISettingsService,
            protected $q: ng.IQService) {
            super(coreService, $scope, cartService, rfqService, accountService, sessionService, settingsService, $q);
            debugger;
            this.init();
        }

        protected submitQuoteCompleted(quote: QuoteModel, successUri): void {
            debugger;
            this.$scope.$root.$broadcast("AnalyticsEvent", "QuoteRequest");
            super.submitQuoteCompleted(quote, successUri);
        }
    }

    angular
        .module("insite")
        .controller("RfqController", NbfRfqController);
}