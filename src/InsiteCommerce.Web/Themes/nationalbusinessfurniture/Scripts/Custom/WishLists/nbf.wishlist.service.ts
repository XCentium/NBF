﻿module insite.wishlist {
    "use strict";

    import WishListCollectionModel = Insite.WishLists.WebApi.V1.ApiModels.WishListCollectionModel;
    import WishListModel = Insite.WishLists.WebApi.V1.ApiModels.WishListModel;
    import WishListLineModel = Insite.WishLists.WebApi.V1.ApiModels.WishListLineModel;
    import WishListLineCollectionModel = Insite.WishLists.WebApi.V1.ApiModels.WishListLineCollectionModel;
    import WishListSettingsModel = Insite.WishLists.WebApi.V1.ApiModels.WishListSettingsModel;

    export interface INbfWishListService {
        getWishLists(sort?: string, expand?: string, wishListLinesSort?: string): ng.IPromise<WishListCollectionModel>;
        getWishList(wishList: WishListModel, expand?: string): ng.IPromise<WishListModel>;
        getListById(listId: System.Guid, expand?: string): ng.IPromise<WishListModel>;
        addWishList(wishListName: string, description?: string): ng.IPromise<WishListModel>;
        deleteWishList(wishList: WishListModel): ng.IPromise<WishListModel>;
        deleteWishListShare(wishList: WishListModel, wishListShareId?: string): ng.IPromise<WishListModel>;
        addWishListLine(wishList: WishListModel, product: ProductDto): ng.IPromise<WishListLineModel>;
        deleteLine(line: WishListLineModel): ng.IPromise<WishListLineModel>;
        deleteLineCollection(wishList: WishListModel, lines: WishListLineModel[]): ng.IPromise<WishListLineCollectionModel>;
        updateWishList(list: WishListModel): ng.IPromise<WishListModel>;
        updateLine(line: WishListLineModel): ng.IPromise<WishListLineModel>;
        addWishListLines(wishList: WishListModel, products: ProductDto[]): ng.IPromise<WishListLineCollectionModel>;
        getWishListSettings(): ng.IPromise<WishListSettingsModel>;
        activateInvite(invite: string): ng.IPromise<WishListModel>;
        sendACopy(list: WishListModel): ng.IPromise<WishListModel>;
        mapWishlistLineToProduct(line: WishListLineModel): ProductDto;
        mapWishListLinesToProducts(lines: WishListLineModel[]): ProductDto[];
        mapProductToWishlistLine(product: ProductDto, line: WishListLineModel): WishListLineModel;
        applyRealTimeInventoryResult(list: WishListModel, result: RealTimeInventoryModel): void;
        updateAvailability(line: WishListLineModel): void;
    }

    export class NbfWishListService implements INbfWishListService {
        serviceUri = "/api/v1/wishlists";
        wishListSettingsUri = "/api/v1/settings/wishlist";
        cacheKey = "addWishListLineProducts";

        static $inject = ["$http", "httpWrapperService", "coreService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService,
            protected coreService: core.ICoreService) {
        }

        getWishLists(sort?: string, expand?: string, wishListLinesSort?: string): ng.IPromise<WishListCollectionModel> {
            const params = {
                sort: sort,
                expand: expand,
                wishListLinesSort: wishListLinesSort
            };

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "GET", url: this.serviceUri, params: params }),
                this.getWishListsCompleted,
                this.getWishListsFailed
            );
        }

        protected getWishListsCompleted(response: ng.IHttpPromiseCallbackArg<WishListCollectionModel>): void {
        }

        protected getWishListsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getWishList(wishList: WishListModel, expand?: string): ng.IPromise<WishListModel> {
            const uri = wishList.uri;

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET", params: this.getWishListParams(wishList.pagination, expand) }),
                this.getWishListCompleted,
                this.getWishListFailed
            );
        }

        getListById(listId: System.Guid, expand?: string): ng.IPromise<WishListModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: this.serviceUri + "/" + listId, method: "GET", params: { expand: expand } }),
                this.getWishListCompleted,
                this.getWishListFailed
            );
        }

        protected getWishListParams(pagination?: PaginationModel, expand?: string): any {
            const params: any = { expand: expand };

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

        addWishList(wishListName: string, description?: string): ng.IPromise<WishListModel> {
            const wishList = angular.toJson({
                name: wishListName,
                description: description ? description : ""
            });

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
        }

        protected deleteWishListFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        deleteWishListShare(wishList: WishListModel, wishListShareId?: string): ng.IPromise<WishListModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.delete(wishList.uri + "/share/" + (wishListShareId ? wishListShareId : "current")),
                this.deleteWishListShareCompleted,
                this.deleteWishListShareFailed
            );
        }

        protected deleteWishListShareCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
        }

        protected deleteWishListShareFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
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

        deleteLineCollection(wishList: WishListModel, lines: WishListLineModel[]): ng.IPromise<WishListLineCollectionModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "DELETE", url: `${wishList.wishListLinesUri}/batch`, params: { wishListLineIds: lines.map(o => o.id) } }),
                this.deleteLineCollectionCompleted,
                this.deleteLineCollectionFailed
            );
        }

        protected deleteLineCollectionCompleted(response: ng.IHttpPromiseCallbackArg<WishListLineCollectionModel>): void {
        }

        protected deleteLineCollectionFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
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

        updateWishList(list: WishListModel): ng.IPromise<WishListModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "PATCH", url: list.uri, data: list }),
                this.updateWishListCompleted,
                this.updateWishListFailed
            );
        }

        protected updateWishListCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
        }

        protected updateWishListFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        activateInvite(invite: string): ng.IPromise<WishListModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "PATCH", url: this.serviceUri + "/activateinvite", data: { invite: invite } }),
                this.updateWishListInviteCompleted,
                this.updateWishListInviteFailed
            );
        }

        protected updateWishListInviteCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
        }

        protected updateWishListInviteFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        sendACopy(list: WishListModel): ng.IPromise<WishListModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "PATCH", url: list.uri + "/sendacopy", data: list }),
                this.updateWishListSendACopyCompleted,
                this.updateWishListSendACopyFailed
            );
        }

        protected updateWishListSendACopyCompleted(response: ng.IHttpPromiseCallbackArg<WishListModel>): void {
        }

        protected updateWishListSendACopyFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
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

        mapWishlistLineToProduct(line: WishListLineModel): ProductDto {
            return {
                id: line.productId,
                productUnitOfMeasures: line.productUnitOfMeasures,
                unitOfMeasure: line.unitOfMeasure,
                selectedUnitOfMeasure: line.selectedUnitOfMeasure,
                quoteRequired: line.quoteRequired,
                pricing: line.pricing,
                qtyOrdered: line.qtyOrdered
            } as ProductDto;
        }

        mapWishListLinesToProducts(lines: WishListLineModel[]): ProductDto[] {
            return lines.map((wishlistLine) => {
                return {
                    id: wishlistLine.productId,
                    unitOfMeasure: wishlistLine.unitOfMeasure,
                    selectedUnitOfMeasure: wishlistLine.unitOfMeasure,
                    qtyOrdered: wishlistLine.qtyOrdered
                };
            }) as ProductDto[];
        }

        mapProductToWishlistLine(product: ProductDto, line: WishListLineModel): WishListLineModel {
            line.productUnitOfMeasures = product.productUnitOfMeasures;
            line.unitOfMeasureDisplay = product.unitOfMeasureDisplay;
            line.unitOfMeasureDescription = product.unitOfMeasureDescription;
            line.unitOfMeasure = product.unitOfMeasure;
            line.canShowUnitOfMeasure = product.canShowUnitOfMeasure;
            line.selectedUnitOfMeasure = product.selectedUnitOfMeasure;
            return line;
        }

        applyRealTimeInventoryResult(list: WishListModel, result: RealTimeInventoryModel): void {
            list.wishListLineCollection.forEach((line: WishListLineModel) => {
                const productInventory = result.realTimeInventoryResults.find((productInventory: ProductInventoryDto) => line.productId === productInventory.productId);
                if (productInventory) {
                    var inventoryAvailability = productInventory.inventoryAvailabilityDtos.find(o => o.unitOfMeasure === line.unitOfMeasure);
                    if (inventoryAvailability) {
                        line.availability = inventoryAvailability.availability;
                    } else {
                        line.availability = { messageType: 0 };
                    }

                    line.productUnitOfMeasures.forEach((productUnitOfMeasure: ProductUnitOfMeasureDto) => {
                        var inventoryAvailability = productInventory.inventoryAvailabilityDtos.find(o => o.unitOfMeasure === productUnitOfMeasure.unitOfMeasure);
                        if (inventoryAvailability) {
                            productUnitOfMeasure.availability = inventoryAvailability.availability;
                        } else {
                            productUnitOfMeasure.availability = { messageType: 0 };
                        }
                    });

                    this.updateAvailability(line);
                }
            });
        }

        updateAvailability(line: WishListLineModel): void {
            if (line && line.productUnitOfMeasures && line.selectedUnitOfMeasure) {
                const productUnitOfMeasure = line.productUnitOfMeasures.find((uom) => uom.unitOfMeasure === line.selectedUnitOfMeasure);
                if (productUnitOfMeasure && (productUnitOfMeasure as any).availability) {
                    line.availability = (productUnitOfMeasure as any).availability;
                }
            }
        }
    }

    angular
        .module("insite")
        .service("nbfWishListService", NbfWishListService);
}