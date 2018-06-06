module insite.wishlist {
    "use strict";

    export class NbfFavoritesQuickViewController extends MyListDetailController {
        init(): void {
            this.getWishLists();

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); }
            );

            this.updateBreadcrumbs();
            this.initCheckStorageWatcher();
            this.initListUpdate();
            this.initSort();
            this.initFilter();
            this.$scope.$on("UploadingItemsToListCompleted", () => this.getList());
            this.initializeAutocomplete();
            this.calculateListHeight();
        }

        getWishLists(): void {
            this.spinnerService.show();
            this.wishListService.getWishLists(this.sort, "wishlistlines", "mostRecent").then(
                (wishListCollection: WishListCollectionModel) => { this.getWishListsCompleted(wishListCollection); },
                (error: any) => { this.getWishListsFailed(error); });
        }

        protected getWishListsCompleted(wishListCollection: WishListCollectionModel): void {
            this.mapData(wishListCollection);
            this.spinnerService.hide();

            // refresh foundation tip hover
            this.$timeout(() => (angular.element(document) as any).foundation("dropdown", "reflow"), 0);
        }

        protected getWishListsFailed(error: any): void {
            this.spinnerService.hide();
        }

        mapData(data: any): void {
            if (data.wishListCollection.length > 0 && this.listSettings && !this.listSettings.allowMultipleWishLists) {
                this.listModel = data.wishListCollection[0];
            }
        }
    }

    angular
        .module("insite")
        .controller("NbfFavoritesQuickViewController", NbfFavoritesQuickViewController);
}