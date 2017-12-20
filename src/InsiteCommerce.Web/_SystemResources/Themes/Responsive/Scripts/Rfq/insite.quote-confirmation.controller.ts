module insite.rfq {
    "use strict";

    export class QuoteConfirmationController {
        confirmedOrderId: any;
        quote: any;

        static $inject = ["rfqService", "queryString"];

        constructor(
            protected rfqService: any,
            protected queryString: common.IQueryStringService) {
            this.init();
        }

        init(): void {
            this.rfqService.expand = "billTo";
            this.confirmedOrderId = this.getConfirmedOrderId();
            this.getQuote();
        }

        protected getConfirmedOrderId(): string {
            return this.queryString.get("cartid");
        }

        getQuote(): void {
            this.rfqService.getQuote(this.confirmedOrderId).then(
                (quote: QuoteModel) => { this.getQuoteCompleted(quote); },
                (error: any) => { this.getQuoteFailed(error); });
        }

        protected getQuoteCompleted(quote: QuoteModel): void {
            this.quote = quote;
            this.quote.cartLines = this.quote.quoteLineCollection;
        }

        protected getQuoteFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("QuoteConfirmationController", QuoteConfirmationController);
}