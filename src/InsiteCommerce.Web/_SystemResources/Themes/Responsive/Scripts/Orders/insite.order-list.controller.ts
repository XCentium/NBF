import KeyValuePair = System.Collections.Generic.KeyValuePair;

module insite.order {
    "use strict";

    export class OrderListController {
        orderHistory: OrderCollectionModel;
        showPoNumber: boolean;
        pagination: PaginationModel;
        paginationStorageKey = "DefaultPagination-OrderList";
        searchFilter: OrderSearchFilter = {
            customerSequence: "-1",
            sort: "OrderDate DESC,ErpOrderNumber DESC",
            toDate: "",
            fromDate: "",
            expand: "",
            ponumber: "",
            ordernumber: "",
            search: "",
            ordertotaloperator: "",
            ordertotal: "",
            status: [],
            statusDisplay: ""
        };
        appliedSearchFilter = new OrderSearchFilter();
        shipTos: ShipToModel[];
        validationMessage: string;
        orderStatusMappings: KeyValuePair<string, string[]>;

        static $inject = ["orderService", "customerService", "coreService", "paginationService", "settingsService"];

        constructor(
            protected orderService: order.IOrderService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService,
            protected settingsService: core.ISettingsService) {
            this.init();
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.customerService.getShipTos().then(
                (shipToCollection: ShipToCollectionModel) => { this.getShipTosCompleted(shipToCollection); },
                (error: any) => { this.getShipTosFailed(error); });

            this.orderService.getOrderStatusMappings().then(
                (orderStatusMappingCollection: OrderStatusMappingCollectionModel) => { this.getOrderStatusMappingCompleted(orderStatusMappingCollection); },
                (error: any) => { this.getOrderStatusMappingFailed(error); });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.showPoNumber = settingsCollection.orderSettings.showPoNumber;
            this.initFromDate(settingsCollection.orderSettings.lookBackDays);
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getShipTosCompleted(shipToCollection: ShipToCollectionModel): void {
            this.shipTos = shipToCollection.shipTos;
        }

        protected getShipTosFailed(error: any): void {
        }

        protected getOrderStatusMappingCompleted(orderStatusMappingCollection: OrderStatusMappingCollectionModel): void {
            this.orderStatusMappings = ({} as KeyValuePair<string, string[]>);

            for (let i = 0; i < orderStatusMappingCollection.orderStatusMappings.length; i++) {
                const key = orderStatusMappingCollection.orderStatusMappings[i].displayName;
                if (!this.orderStatusMappings[key]) {
                    this.orderStatusMappings[key] = [];
                }

                this.orderStatusMappings[key].push(orderStatusMappingCollection.orderStatusMappings[i].erpOrderStatus);
            }
        }

        protected getOrderStatusMappingFailed(error: any): void {
        }

        protected initFromDate(lookBackDays: number): void {
            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);

            if (lookBackDays > 0) {
                const date = new Date(Date.now() - lookBackDays * 60 * 60 * 24 * 1000);
                this.searchFilter.fromDate = date.toISOString().split("T")[0];
            }

            this.restoreHistory();
            this.prepareSearchFilter();
            this.getOrders();
        }

        clear(): void {
            this.pagination.page = 1;
            this.searchFilter.customerSequence = "-1";
            this.searchFilter.sort = "OrderDate DESC,ErpOrderNumber DESC";
            this.searchFilter.toDate = "";
            this.searchFilter.fromDate = "";
            this.searchFilter.ponumber = "";
            this.searchFilter.ordernumber = "";
            this.searchFilter.search = "";
            this.searchFilter.ordertotaloperator = "";
            this.searchFilter.ordertotal = "";
            this.searchFilter.status = [];
            this.searchFilter.statusDisplay = "";

            this.prepareSearchFilter();
            this.getOrders();
        }

        changeSort(sort: string): void {
            if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                this.searchFilter.sort = `${sort.replace(",", " DESC,")} DESC`;
            } else {
                this.searchFilter.sort = sort;
            }

            this.getOrders();
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }

            this.prepareSearchFilter();
            this.getOrders();
        }

        getOrders(): void {
            this.appliedSearchFilter.sort = this.searchFilter.sort;
            this.coreService.replaceState({ filter: this.appliedSearchFilter, pagination: this.pagination });

            delete this.appliedSearchFilter.statusDisplay;
            this.orderService.getOrders(this.appliedSearchFilter, this.pagination).then(
                (orderCollection: OrderCollectionModel) => { this.getOrdersCompleted(orderCollection); },
                (error: any) => { this.getOrdersFailed(error); });
        }

        protected getOrdersCompleted(orderCollection: OrderCollectionModel): void {
            this.orderHistory = orderCollection;
            this.pagination = orderCollection.pagination;
        }

        protected getOrdersFailed(error: any): void {
            this.validationMessage = error.exceptionMessage;
        }

        prepareSearchFilter(): void {
            for (let property in this.searchFilter) {
                if (this.searchFilter.hasOwnProperty(property)) {
                    if (this.searchFilter[property] === "") {
                        this.appliedSearchFilter[property] = null;
                    } else {
                        this.appliedSearchFilter[property] = this.searchFilter[property];
                    }
                }
            }

            if (this.appliedSearchFilter.statusDisplay && this.orderStatusMappings && this.orderStatusMappings[this.appliedSearchFilter.statusDisplay]) {
                this.appliedSearchFilter.status = this.orderStatusMappings[this.appliedSearchFilter.statusDisplay];
            }
        }

        protected restoreHistory(): void {
            const state = this.coreService.getHistoryState();
            if (state) {
                if (state.pagination) {
                    this.pagination = state.pagination;
                }

                if (state.filter) {
                    this.searchFilter = state.filter;
                    if (this.searchFilter.customerSequence === null) {
                        this.searchFilter.customerSequence = "-1";
                    }

                    if (this.searchFilter.statusDisplay === null) {
                        this.searchFilter.statusDisplay = "";
                    }
                }
            }
        }
    }

    angular
        .module("insite")
        .controller("OrderListController", OrderListController);
}