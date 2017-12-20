﻿module insite.wishlist {
    "use strict";

    export class AddToWishlistPopupController {
        errorMessage: string;
        newWishListName: string;
        selectedWishList: WishListModel;
        addToWishlistCompleted: boolean;
        wishListCollection: WishListModel[];
        showWishlistNameErrorMessage: boolean;
        allowMultipleWishLists: boolean;
        isAuthenticated: boolean;
        popupId: string;
        productsToAdd: ProductDto[];
        isRememberedUser: boolean;

        static $inject = ["wishListService", "coreService", "settingsService", "addToWishlistPopupService", "accessToken", "sessionService"];

        constructor(
            protected wishListService: IWishListService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected addToWishlistPopupService: AddToWishlistPopupService,
            protected accessToken: common.IAccessTokenService,
            protected sessionService: account.ISessionService) {
            this.init();
        }

        init(): void {
            this.productsToAdd = [];

            this.settingsService.getSettings().then(
                (settings: core.SettingsCollection) => { this.getSettingsCompleted(settings); },
                (error: any) => { this.getSettingsFailed(error); });
        }

        protected getSettingsCompleted(settings: core.SettingsCollection): void {
            this.allowMultipleWishLists = settings.wishListSettings.allowMultipleWishLists;

            this.addToWishlistPopupService.registerDisplayFunction((data) => {
                const context = this.sessionService.getContext();
                this.isAuthenticated = this.accessToken.exists();
                this.isRememberedUser = context.isRememberedUser;
                this.productsToAdd = data;
                this.initialize();
                this.coreService.displayModal(angular.element("#popup-add-wishlist"));
            });
        }

        protected getSettingsFailed(error: any): void {
        }

        initialize(): void {
            if (this.isAuthenticated || this.isRememberedUser) {
                this.clearMessages();
                this.newWishListName = "";
                if (this.allowMultipleWishLists) {
                    this.wishListService.getWishLists().then(
                        (wishListCollection: WishListCollectionModel) => { this.getWishListCollectionCompleted(wishListCollection); },
                        (error: any) => { this.getWishListCollectionFailed(error); });
                } else {
                    this.addWishList(this.newWishListName);
                }
            }
        }

        protected getWishListCollectionCompleted(wishListCollection: WishListCollectionModel): void {
            this.wishListCollection = wishListCollection.wishListCollection;
        }

        protected getWishListCollectionFailed(error: any): void {
            this.errorMessage = error.message;
        }

        clearMessages(): void {
            this.addToWishlistCompleted = false;
            this.errorMessage = "";
            this.showWishlistNameErrorMessage = false;
        }

        changeWishList(): void {
            this.newWishListName = "";
            this.clearMessages();
        }

        addWishList(wishListName: string): void {
            this.wishListService.addWishList(wishListName).then(
                (newWishList: WishListModel) => { this.addWishListCompleted(newWishList); },
                (error: any) => { this.addWishListFailed(error); });
        }

        protected addWishListCompleted(newWishList: WishListModel): void {
            this.addProductsToWishList(newWishList);
        }

        protected addWishListFailed(error: any): void {
            this.errorMessage = error.message;
        }

        addToWishList(): void {
            this.clearMessages();
            if (this.selectedWishList) {
                this.addProductsToWishList(this.selectedWishList);
            } else {
                if (this.newWishListName && this.newWishListName.trim().length > 0) {
                    this.addWishList(this.newWishListName);
                } else {
                    this.showWishlistNameErrorMessage = true;
                }
            }
        }

        protected addProductsToWishList(wishList: WishListModel): void {
            if (this.productsToAdd.length === 1) {
                this.addLineToWishList(wishList);
            } else {
                this.addLineCollectionToWishList(wishList);
            }
        }

        protected addLineToWishList(wishList: WishListModel): void {
            this.wishListService.addWishListLine(wishList, this.productsToAdd[0]).then(
                (wishListLine: WishListLineModel) => { this.addWishListLineCompleted(wishListLine); },
                (error: any) => { this.addWishListLineFailed(error); });
        }

        protected addWishListLineCompleted(wishListLine: WishListLineModel): void {
            this.addToWishlistCompleted = true;
        }

        protected addWishListLineFailed(error: any): void {
            this.errorMessage = error.message;
        }

        protected addLineCollectionToWishList(wishList: WishListModel): void {
            this.wishListService.addWishListLines(wishList, this.productsToAdd).then(
                (wishListLineCollection: WishListLineCollectionModel) => { this.addWishListLineCollectionCompleted(wishListLineCollection); },
                (error: any) => { this.addWishListLineCollectionFailed(error); });
        }

        protected addWishListLineCollectionCompleted(wishListLineCollection: WishListLineCollectionModel): void {
            this.addToWishlistCompleted = true;
        }

        protected addWishListLineCollectionFailed(error: any): void {
            this.errorMessage = error.message;
        }
    }

    export interface IAddToWishlistPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class AddToWishlistPopupService extends base.BasePopupService<any> implements IAddToWishlistPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-add-to-wishlist-popup></isc-add-to-wishlist-popup>";
        }
    }

    angular
        .module("insite")
        .controller("AddToWishlistPopupController", AddToWishlistPopupController)
        .service("addToWishlistPopupService", AddToWishlistPopupService)
        .directive("iscAddToWishlistPopup", () => ({
            restrict: "E",
            replace: true,
            scope: {
                popupId: "@"
            },
            templateUrl: "/PartialViews/WishList-AddToWishlistPopup",
            controller: "AddToWishlistPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}