import WishListCollectionModel = Insite.WishLists.WebApi.V1.ApiModels.WishListCollectionModel;
import WishListModel = Insite.WishLists.WebApi.V1.ApiModels.WishListModel;
import WishListLineModel = Insite.WishLists.WebApi.V1.ApiModels.WishListLineModel;
import WishListLineCollectionModel = Insite.WishLists.WebApi.V1.ApiModels.WishListLineCollectionModel;
import WishListSettingsModel = Insite.WishLists.WebApi.V1.ApiModels.WishListSettingsModel;

module insite.wishlist {
    "use strict";

    export interface IWishListService {
        getWishLists(): ng.IPromise<WishListCollectionModel>;
        getWishList(wishList: WishListModel): ng.IPromise<WishListModel>;
        addWishList(wishListName: string): ng.IPromise<WishListModel>;
        deleteWishList(wishList: WishListModel): ng.IPromise<WishListModel>;
        addWishListLine(wishList: WishListModel, product: ProductDto): ng.IPromise<WishListLineModel>;
        deleteLine(line: WishListLineModel): ng.IPromise<WishListLineModel>;
        updateLine(line: WishListLineModel): ng.IPromise<WishListLineModel>;
        addWishListLines(wishList: WishListModel, products: ProductDto[]): ng.IPromise<WishListLineCollectionModel>;
        getWishListSettings(): ng.IPromise<WishListSettingsModel>;
    }

    export class WishListService implements IWishListService {
        serviceUri = "/api/v1/wishlists";
        wishListSettingsUri = "/api/v1/settings/wishlist";
        cacheKey = "addWishListLineProducts";

        static $inject = ["$http", "httpWrapperService", "coreService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService,
            protected coreService: core.ICoreService) {
        }

        getWishLists(): ng.IPromise<WishListCollectionModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.get(this.serviceUri),
                this.getWishListsCompleted,
                this.getWishListsFailed
            );
        }

        protected getWishListsCompleted(response: ng.IHttpPromiseCallbackArg<WishListCollectionModel>): void {
        }

        protected getWishListsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getWishList(wishList: WishListModel): ng.IPromise<WishListModel> {
            const uri = wishList.uri;

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET", params: this.getWishListParams(wishList.pagination) }),
                this.getWishListCompleted,
                this.getWishListFailed
            );
        }

        protected getWishListParams(pagination?: PaginationModel): any {
            const params: any = {};

            if (pagination) {
                params.page = pagination.page;
                params.pageSize = pagination.pageSize;
            }

            return params;
        }

        protected getWishListCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
        }

        protected getWishListFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        addWishList(wishListName: string): ng.IPromise<WishListModel> {
            const wishList = angular.toJson({ name: wishListName });

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.post(this.serviceUri, wishList),
                this.addWishListCompleted,
                this.addWishListFailed
            );
        }

        protected addWishListCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
        }

        protected addWishListFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        deleteWishList(wishList: WishListModel): ng.IPromise<WishListModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.delete(wishList.uri),
                this.deleteWishListCompleted,
                this.deleteWishListFailed
            );
        }

        protected deleteWishListCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
            this.getWishLists();
        }

        protected deleteWishListFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        addWishListLine(wishList: WishListModel, product: ProductDto): ng.IPromise<WishListLineModel> {
            const wishListLine = {} as WishListLineModel;
            wishListLine.productId = product.id;
            wishListLine.qtyOrdered = product.qtyOrdered;
            wishListLine.unitOfMeasure = product.selectedUnitOfMeasure;

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.post(wishList.wishListLinesUri, wishListLine),
                this.addWishListLineCompleted,
                this.addWishListLineFailed
            );
        }

        protected addWishListLineCompleted(response: ng.IHttpPromiseCallbackArg<WishListLineModel>): void {
        }

        protected addWishListLineFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        deleteLine(line: WishListLineModel): ng.IPromise<WishListLineModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.delete(line.uri),
                this.deleteLineCompleted,
                this.deleteLineFailed
            );
        }

        protected deleteLineCompleted(response: ng.IHttpPromiseCallbackArg<WishListLineModel>): void {
        }

        protected deleteLineFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        updateLine(line: WishListLineModel): ng.IPromise<WishListLineModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "PATCH", url: line.uri, data: line }),
                this.updateLineCompleted,
                this.updateLineFailed
            );
        }

        protected updateLineCompleted(response: ng.IHttpPromiseCallbackArg<WishListLineModel>): void {
        }

        protected updateLineFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        addWishListLines(wishList: WishListModel, products: ProductDto[]): ng.IPromise<WishListLineCollectionModel> {
            const wishListLineCollection = { wishListLines: this.getWishListLinesFromProducts(products) };
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.post(`${wishList.wishListLinesUri}/batch`, wishListLineCollection),
                this.addWishListLinesCompleted,
                this.addWishListLinesFailed
            );
        }

        protected addWishListLinesCompleted(response: ng.IHttpPromiseCallbackArg<WishListLineCollectionModel>): void {
        }

        protected addWishListLinesFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getWishListSettings(): ng.IPromise<WishListSettingsModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.get(this.wishListSettingsUri),
                this.getWishListSettingsCompleted,
                this.getWishListSettingsFailed
            );
        }

        protected getWishListSettingsCompleted(response: ng.IHttpPromiseCallbackArg<WishListSettingsModel>): void {
        }

        protected getWishListSettingsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        protected getWishListLinesFromProducts(products: ProductDto[]): WishListLineModel[] {
            const wishListLineCollection: WishListLineModel[] = [];
            angular.forEach(products, product => {
                wishListLineCollection.push({
                    productId: product.id,
                    qtyOrdered: product.qtyOrdered,
                    unitOfMeasure: product.selectedUnitOfMeasure
                } as WishListLineModel);
            });

            return wishListLineCollection;
        }
    }

    angular
        .module("insite")
        .service("wishListService", WishListService);
}