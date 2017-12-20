module insite.rfq {
    "use strict";

    export class QuoteMessagesController {
        quoteId: string;
        rfqMessage: string;

        static $inject = ["$scope", "rfqService", "queryString"];

        constructor(
            protected $scope: ng.IScope,
            protected rfqService: rfq.IRfqService,
            protected queryString: common.IQueryStringService) {

            this.init();
        }

        init(): void {
            this.quoteId = this.getQuoteId();
        }

        protected getQuoteId(): string {
            return this.queryString.get("quoteId");
        }

        sendMessage(): any {
            const parameter = {
                quoteId: this.quoteId as System.Guid,
                message: this.rfqMessage
            } as RfqMessageModel;

            this.rfqService.submitRfqMessage(parameter).then(
                (rfqMessage: RfqMessageModel) => { this.submitRfqMessageCompleted(rfqMessage); },
                (error: any) => { this.submitRfqMessageFailed(error); });
        }

        protected submitRfqMessageCompleted(rfqMessage: RfqMessageModel): void {
            (this.$scope as any).messageCollection.push(rfqMessage);
            this.$scope.$broadcast("messagesloaded");
            this.rfqMessage = "";
        }

        protected submitRfqMessageFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("QuoteMessagesController", QuoteMessagesController);
}