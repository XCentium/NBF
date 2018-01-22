module nbf.OrderTracker {
    "use strict";

    export interface IOrderTrackerService {
        getOrder(orderId: string, phone: string): ng.IPromise<OrderModel>;
    }

    export class NbfOrderTrackerService implements IOrderTrackerService {
        serviceUri = "/api/nbf/trackorder";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService) {
        }

        getOrder(orderId: string, phoneNumber: string): ng.IPromise<OrderModel> {
            const uri = `${this.serviceUri}`;
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET", params: this.getOrderParams(orderId, phoneNumber) }),
                this.getOrderCompleted,
                this.getOrderFailed
            );
        }

        protected getOrderCompleted(response: ng.IHttpPromiseCallbackArg<OrderModel>): void {
            
        }

        protected getOrderFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            
        }

        protected getOrderParams(orderId: string, phoneNumber: string): any {
            const params: any = {};
            params.orderId = orderId;
            params.phoneNumber = phoneNumber;

            return params;
        }
    }

    angular
        .module("insite")
        .service("nbfOrderTrackerService", NbfOrderTrackerService);
}