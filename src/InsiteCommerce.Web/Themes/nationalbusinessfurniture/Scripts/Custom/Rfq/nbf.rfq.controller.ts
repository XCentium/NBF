module nbf.rfq {
    "use strict";

    export class NbfRfqController extends insite.rfq.RfqController{
        protected submitQuoteCompleted(quote: QuoteModel, successUri): void {
            this.$scope.$root.$broadcast("AnalyticsEvent", "QuoteRequest");
            super.submitQuoteCompleted(quote, successUri);
        }
    }

    angular
        .module("insite")
        .controller("RfqController", NbfRfqController);
}