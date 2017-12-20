module insite.invoice {
    "use strict";

    export class InvoiceListController {
        invoiceHistory: InvoiceCollectionModel;
        pagination: PaginationModel;
        paginationStorageKey = "DefaultPagination-InvoiceList";
        searchFilter: invoice.ISearchFilter;
        shipTos: ShipToModel[];
        validationMessage: string;

        static $inject = ["invoiceService", "customerService", "coreService", "paginationService", "settingsService"];

        constructor(
            protected invoiceService: invoice.IInvoiceService,
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
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.searchFilter = this.getDefaultSearchFilter();
            this.setInitialFromDate(settingsCollection.invoiceSettings.lookBackDays);
            this.restoreHistory();

            this.getInvoices();
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getShipTosCompleted(shipToCollection: ShipToCollectionModel): void {
            this.shipTos = shipToCollection.shipTos;
        }

        protected getShipTosFailed(error: any): void {
        }

        clear(): void {
            this.pagination.page = 1;
            this.searchFilter = this.getDefaultSearchFilter();

            this.getInvoices();
        }

        changeSort(sort: string): void {
            if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                this.searchFilter.sort = `${sort} DESC`;
            } else {
                this.searchFilter.sort = sort;
            }

            this.getInvoices();
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }

            this.getInvoices();
        }

        getInvoices(): void {
            this.updateHistory();

            this.invoiceService.getInvoices(this.searchFilter, this.pagination).then(
                (invoiceCollection: InvoiceCollectionModel) => { this.getInvoicesCompleted(invoiceCollection); },
                (error: any) => { this.getInvoicesFailed(error); });
        }

        protected getInvoicesCompleted(invoiceCollection: InvoiceCollectionModel): void {
            this.invoiceHistory = invoiceCollection;
            this.pagination = invoiceCollection.pagination;
        }

        protected getInvoicesFailed(error: any): void {
            this.validationMessage = error.exceptionMessage || error.message;
        }

        protected restoreHistory(): void {
            const state = this.coreService.getHistoryState();
            if (state) {
                if (state.pagination) {
                    this.pagination = state.pagination;
                }
                if (state.filter) {
                    this.searchFilter = state.filter;
                }
            }
        }

        protected updateHistory(): void {
            this.coreService.pushState({ filter: this.searchFilter, pagination: this.pagination });
        }

        protected setInitialFromDate(lookBackDays: number): void {
            if (lookBackDays > 0) {
                const date = new Date(Date.now() - lookBackDays * 60 * 60 * 24 * 1000);
                this.searchFilter.fromDate = date.toISOString().split("T")[0];
            }
        }

        protected getDefaultSearchFilter(): invoice.ISearchFilter {
            return {
                customerSequence: "-1",
                sort: "InvoiceDate DESC",
                fromDate: ""
            };
        }
    }

    angular
        .module("insite")
        .controller("InvoiceListController", InvoiceListController);
}