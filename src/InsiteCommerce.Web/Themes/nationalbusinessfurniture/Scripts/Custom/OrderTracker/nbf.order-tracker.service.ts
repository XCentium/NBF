module nbf.OrderTracker {
    "use strict";

    export interface INbfOrderTrackerService {
        getOrderId(orderNo: string, phone: string): ng.IPromise<string>;
        getOrder(orderId: string): ng.IPromise<OrderModel>;
    }

    export class NbfOrderTrackerService implements INbfOrderTrackerService {
        orderIdUri = "/api/nbf/TrackOrder";
        orderUri = "/api/nbf/TrackOrder/Details";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService) {
        }

        getOrderId(orderNo: string, phoneNumber: string): ng.IPromise<string> {
            const uri = this.orderIdUri;
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET", params: this.getOrderParams(orderNo, phoneNumber) }),
                this.getOrderIdCompleted,
                this.getOrderIdFailed
            );
        }

        getOrder(orderId: string): ng.IPromise<OrderModel> {
            const uri = this.orderUri;
            const params: any = {
                orderId: orderId,
                expand: "orderlines,shipments"
        };
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET", params: params }),
                this.getOrderIdCompleted,
                this.getOrderIdFailed
            );
        }

        protected getOrderIdCompleted(response: ng.IHttpPromiseCallbackArg<OrderModel>): void {
            
        }

        protected getOrderIdFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            
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