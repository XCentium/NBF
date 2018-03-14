module insite.core {
    "use strict";

    export class NbfPagerController extends PagerController {
        perPage: boolean;

        showPerPage(): boolean {
            return !this.bottom && this.pagination.totalItemCount > this.pagination.defaultPageSize && this.perPage;
        }
    }

    angular
        .module("insite")
        .controller("NbfPagerController", NbfPagerController);
}