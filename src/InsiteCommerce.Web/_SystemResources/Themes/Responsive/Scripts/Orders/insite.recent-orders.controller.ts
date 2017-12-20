module insite.order {
    "use strict";

    class RecentOrdersPaginationModel implements PaginationModel {
        currentPage: number;
        page: number;
        pageSize: number;
        defaultPageSize: number;
        totalItemCount: number;
        numberOfPages: number;
        pageSizeOptions: number[];
        sortOptions: Insite.Core.WebApi.SortOptionModel[];
        sortType: string;
        nextPageUri: string;
        prevPageUri: string;

        constructor() {
            this.numberOfPages = 1;
            this.pageSize = 5;
            this.page = 1;
        }
    }

    export class RecentOrdersController extends OrderDetailController {
        orderHistory: OrderCollectionModel;

        init(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            if (!session.userRoles || session.userRoles.indexOf("Requisitioner") === -1) {
                this.getRecentOrders();
            }
        }

        protected getSessionFailed(error: any): void {
        }

        getRecentOrders(): void {
            const filter = new OrderSearchFilter();
            filter.sort = "OrderDate DESC";
            filter.customerSequence = "-1";

            const pagination = new RecentOrdersPaginationModel();

            this.orderService.getOrders(filter, pagination).then(
                (orderCollection: OrderCollectionModel) => { this.getOrdersCompleted(orderCollection); },
                (error) => { this.getOrderFailed(error); });
        }

        protected getOrdersCompleted(orderCollection: OrderCollectionModel): void {
            this.orderHistory = orderCollection;
        }

        protected getOrdersFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("RecentOrdersController", RecentOrdersController);
}