module insite.wishlist {
    "use strict";

    export class NbfFavoritesQuickViewController {
        listId: string;
        invite: string;
        listModel: WishListModel;
        listSettings: WishListSettingsModel;
        productSettings: ProductSettingsModel;
        inProgress = false;
        checkStorage: {} = {};
        checkedItemsCount = 0;
        canPutAnySelectedToCart = false;
        currencySymbol: string;
        listTotal: number = 0;
        selectedListLines: WishListLineModel[];
        session: SessionModel;
        failedToGetRealTimeInventory = false;
        sortableOptions: any;
        sort: string = "custom";
        sortProperty: string = "sortOrder";
        reverse: boolean = false;
        searchTerm: string = "";
        inviteIsNotAvailable: boolean;

        addingSearchTerm: string = "";
        successMessage: string;
        errorMessage: string;
        itemToAdd: ProductDto;
        selectedQty: number;
        autocompleteOptions: AutoCompleteOptions;
        isAddToListSectionVisible: boolean = false;
        isAddingToList: boolean = false;

        notAvailableProducts: WishListLineModel[];
        notVisibleProducts: WishListLineModel[];
        hideNotVisibleProducts: boolean;

        noteForm: any;
        editNote: boolean;
        listLineNote: string;
        noteErrorMessage: string;
        orderIsSaving: boolean;

        static $inject = [
            "$scope",
            "settingsService",
            "queryString",
            "wishListService",
            "cartService",
            "productService",
            "sessionService",
            "$timeout",
            "$interval",
            "coreService",
            "spinnerService",
            "$location",
            "shareListPopupService",
            "uploadToListPopupService",
            "$localStorage",
            "searchService",
            "productPriceService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected settingsService: core.ISettingsService,
            protected queryString: common.IQueryStringService,
            protected wishListService: IWishListService,
            protected cartService: cart.ICartService,
            protected productService: catalog.IProductService,
            protected sessionService: account.ISessionService,
            protected $timeout: ng.ITimeoutService,
            protected $interval: ng.IIntervalService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected $location: ng.ILocationService,
            protected shareListPopupService: IShareListPopupService,
            protected uploadToListPopupService: IUploadToListPopupService,
            protected $localStorage: common.IWindowStorage,
            protected searchService: catalog.ISearchService,
            protected productPriceService: catalog.IProductPriceService
        ) {
            this.init();
        }

        init(): void {
            this.getWishLists();

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); }
            );
            
            this.$scope.$on("UploadingItemsToListCompleted", () => this.getList());
            this.calculateListHeight();
        }

        protected updateWishListInviteCompleted(wishList: WishListModel): void {
            this.$location.search({
                id: wishList.id,
                invite: null
            });
        }

        protected updateWishListInviteFailed(error: any): void {
            this.inviteIsNotAvailable = true;
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

        protected calculateListHeight(): void {
            const interval = this.$interval(() => {
                const list = angular.element("ul.item-list[ui-sortable]:visible");
                if (list.length > 0) {
                    list.css("height", "auto");
                    list.height(list.height());
                } else if (!this.inProgress) {
                    this.$interval.cancel(interval);
                }
            }, 300);
        }

        calculateCheckedItems(): void {
            this.checkedItemsCount = 0;
            this.canPutAnySelectedToCart = false;

            if (!this.listModel || !this.listModel.wishListLineCollection) {
                return;
            }

            for (let i = 0; i < this.listModel.wishListLineCollection.length; i++) {
                if (this.checkStorage[this.listModel.wishListLineCollection[i].id.toString()]) {
                    this.checkedItemsCount++;

                    if (this.listModel.wishListLineCollection[i].canAddToCart) {
                        this.canPutAnySelectedToCart = true;
                    }
                }
            }
        }

        protected closeModal(selector: string): void {
            this.coreService.closeModal(selector);
        }

        setListItem(wishListLine: WishListLineModel): void {
            this.selectedListLines = [wishListLine];
            this.editNote = !!wishListLine.notes;
            this.listLineNote = wishListLine.notes;
        }

        deleteListItem(): void {
            this.spinnerService.show();
            this.closeModal("#popup-delete-item");
            if (this.selectedListLines.length === 1) {
                this.deleteLine(this.selectedListLines[0]);
            } else {
                this.deleteLines(this.listModel, this.selectedListLines);
            }
        }

        deleteLines(list: WishListModel, lines: WishListLineModel[]): void {
            if (this.inProgress) {
                return;
            }

            this.inProgress = true;
            this.wishListService.deleteLineCollection(list, lines).then(
                (wishListLineCollection: WishListLineCollectionModel) => {
                    this.deleteLineCollectionCompleted(wishListLineCollection);
                },
                (error: any) => { this.deleteLineCollectionFailed(error); });
        }

        protected deleteLineCollectionCompleted(wishListLineCollection: WishListLineCollectionModel): void {
            this.getList();
        }

        protected deleteLineCollectionFailed(error: any): void {
        }

        deleteSelectedItems(): void {
            this.selectedListLines = [];
            for (let i = 0; i < this.listModel.wishListLineCollection.length; i++) {
                if (this.checkStorage[this.listModel.wishListLineCollection[i].id.toString()]) {
                    this.selectedListLines.push(this.listModel.wishListLineCollection[i]);
                }
            }
        }

        deleteList(navigateTo: string): void {
            this.wishListService.deleteWishList(this.listModel).then(
                (wishList: WishListModel) => { this.deleteWishListCompleted(navigateTo, wishList); },
                (error: any) => { this.deleteWishListFailed(error); });
        }

        protected deleteWishListCompleted(navigateTo: string, wishList: WishListModel): void {
            this.closeModal("#popup-delete-list");
            this.spinnerService.show();
            this.coreService.redirectToPath(navigateTo);
        }

        protected deleteWishListFailed(error: any): void {
        }

        selectAll(): void {
            if (this.isAllSelected()) {
                this.checkStorage = {};
            } else {
                for (let i = 0; i < this.listModel.wishListLineCollection.length; i++) {
                    this.checkStorage[this.listModel.wishListLineCollection[i].id.toString()] = true;
                }
            }
        }

        isAllSelected(): boolean {
            return this.checkedItemsCount === this.listModel.wishListLineCollection.length;
        }

        checkProduct(productLineId: System.Guid): void {
            if (this.checkStorage[productLineId.toString()]) {
                delete this.checkStorage[productLineId.toString()];
            } else {
                this.checkStorage[productLineId.toString()] = true;
            }
        }

        isProductChecked(productLineId: System.Guid): boolean {
            return !!this.checkStorage[productLineId.toString()];
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.productSettings = settingsCollection.productSettings;
            this.listSettings = settingsCollection.wishListSettings;
            if (this.listId) {
                this.getList();
            }
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.currencySymbol = session.currency.currencySymbol;
            this.session = session;
        }

        protected getSessionFailed(error: any): void {
        }

        getList(): void {
            this.inProgress = true;
            this.spinnerService.show();
            this.wishListService.getListById(this.listId, "hiddenproducts,getalllines").then(
                (listModel: WishListModel) => { this.getListCompleted(listModel); },
                (error: any) => { this.getListFailed(error); });
        }

        calculateListTotal(): void {
            this.listTotal = 0;
            for (let i = 0; i < this.listModel.wishListLineCollection.length; i++) {
                const product = this.wishListService.mapWishlistLineToProduct(this.listModel.wishListLineCollection[i]);

                if (product.pricing) {
                    const unitNetPrice = this.productPriceService.getUnitNetPrice(product).price;
                    const extendedNetPrice = Math.round(unitNetPrice *
                            product.qtyOrdered *
                            100) /
                        100;

                    this.listTotal += extendedNetPrice;
                }
            }

            this.listTotal = Math.round(this.listTotal * 100) / 100;
        }

        removeHiddenProducts(): void {
            const outOfStock = 2;
            this.notAvailableProducts = [];
            this.notVisibleProducts = [];

            if (!this.listModel.wishListLineCollection || this.listModel.wishListLineCollection.length === 0) {
                return;
            }

            this.notAvailableProducts =
                this.listModel.wishListLineCollection.filter(o => !o.isActive || (o.isDiscontinued && (<any>o.availability).messageType === outOfStock));
            const inactiveProductIds = this.notAvailableProducts.map(o => o.id);
            this.notVisibleProducts =
                this.listModel.wishListLineCollection.filter(o => !o.isVisible &&
                    inactiveProductIds.indexOf(o.id) === -1);
            this.listModel.wishListLinesCount -= (this.notAvailableProducts.length + this.notVisibleProducts.length);

            this.listModel.wishListLineCollection =
                this.listModel.wishListLineCollection.filter(o => o.isActive && (!o.isDiscontinued || (<any>o.availability).messageType !== outOfStock) && o.isVisible);
        }

        protected getListCompleted(listModel: WishListModel): void {
            this.inProgress = false;
            this.spinnerService.hide();

            this.listModel = listModel;
            this.removeHiddenProducts();
            this.calculateCheckedItems();

            this.getRealTimePrices();
            if (!this.productSettings.inventoryIncludedWithPricing) {
                this.getRealTimeInventory();
            }

            this.calculateListTotal();

            // refresh foundation tip hover
            this.$timeout(() => (angular.element(document) as any).foundation("dropdown", "reflow"), 0);
        }

        protected getListFailed(error: any): void {
            this.spinnerService.hide();
        }

        protected getRealTimePrices(): void {
            if (this.productSettings.realTimePricing && this.listModel.wishListLineCollection != null) {
                const products = this.wishListService.mapWishListLinesToProducts(this.listModel.wishListLineCollection);

                this.productService.getProductRealTimePrices(products).then(
                    (pricingResult: RealTimePricingModel) => { this.handleRealTimePricesCompleted(pricingResult); },
                    (reason: any) => { this.handleRealtimePricesFailed(reason); });
            }
        }

        protected handleRealTimePricesCompleted(result: RealTimePricingModel): void {
            result.realTimePricingResults.forEach((productPrice: ProductPriceDto) => {
                const wishlistLine = this.listModel.wishListLineCollection.find(
                    (p: WishListLineModel) => p.productId === productPrice.productId &&
                    p.unitOfMeasure === productPrice.unitOfMeasure);
                wishlistLine.pricing = productPrice;
            });

            this.calculateListTotal();

            if (this.productSettings.inventoryIncludedWithPricing) {
                this.getRealTimeInventory();
            }
        }

        protected handleRealtimePricesFailed(reason: any): void {
            this.listModel.wishListLineCollection.forEach(p => {
                if (p.pricing) {
                    (p.pricing as any).failedToGetRealTimePrices = true;
                }
            });
        }

        protected getRealTimeInventory(): void {
            if (this.productSettings.realTimeInventory && this.listModel.wishListLineCollection != null) {
                const products =
                    this.listModel.wishListLineCollection.map(
                        wishlistLine => this.wishListService.mapWishlistLineToProduct(wishlistLine));

                this.productService.getProductRealTimeInventory(products).then(
                    (inventoryResult: RealTimeInventoryModel) => {
                        this.handleRealTimeInventoryCompleted(inventoryResult);
                    },
                    (reason: any) => { this.handleRealtimeInventoryFailed(reason); });
            }
        }

        protected handleRealTimeInventoryCompleted(result: RealTimeInventoryModel): void {
            this.wishListService.applyRealTimeInventoryResult(this.listModel, result);
        }

        protected handleRealtimeInventoryFailed(reason: any): void {
            this.failedToGetRealTimeInventory = true;
        }

        addAllToCart(wishList: WishListModel): void {
            this.inProgress = true;
            this.cartService.addLineCollection(wishList.wishListLineCollection, true).then(
                (cartLineCollection: CartLineCollectionModel) => {
                    this.addLineCollectionCompleted(cartLineCollection);
                },
                (error: any) => { this.addLineCollectionFailed(error); });
        }

        protected addLineCollectionCompleted(cartLineCollection: CartLineCollectionModel): void {
            this.inProgress = false;
        }

        protected addLineCollectionFailed(error: any): void {
            this.inProgress = false;
        }

        updateLine(line: WishListLineModel): void {
            if (line.qtyOrdered > 0) {
                this.wishListService.updateLine(line).then(
                    (wishListLine: WishListLineModel) => { this.updateLineCompleted(wishListLine); },
                    (error: any) => { this.updateLineFailed(error); });
            }
        }

        deleteLine(line: WishListLineModel): void {
            if (this.inProgress) {
                return;
            }

            this.inProgress = true;
            this.wishListService.deleteLine(line).then(
                (wishListLine: WishListLineModel) => { this.deleteLineCompleted(wishListLine); },
                (error: any) => { this.deleteLineFailed(error); });
        }

        protected deleteLineCompleted(wishListLine: WishListLineModel): void {
            this.getList();
        }

        protected deleteLineFailed(error: any): void {
        }

        protected updateLineCompleted(wishListLine: WishListLineModel): void {
            this.getList();
        }

        protected updateLineFailed(error: any): void {
        }

        quantityKeyPress(line: WishListLineModel): void {
            this.updateLine(line);
        }

        addSelectedToCart(): void {
            let lines = [];
            for (let i = 0; i < this.listModel.wishListLineCollection.length; i++) {
                if (this.listModel.wishListLineCollection[i].canAddToCart &&
                    this.checkStorage[this.listModel.wishListLineCollection[i].id.toString()]) {
                    lines.push(this.listModel.wishListLineCollection[i]);
                }
            }

            this.cartService.addLineCollection(lines, true).then(
                (cartLineCollection: CartLineCollectionModel) => {
                    this.addLineCollectionCompleted(cartLineCollection);
                },
                (error: any) => { this.addLineCollectionFailed(error); });
        }

        addLineToCart(line: any): void {
            this.cartService.addLine(line, true).then(
                (cartLine: CartLineModel) => { this.addLineCompleted(cartLine); },
                (error: any) => { this.addLineFailed(error); });
        }

        protected addLineCompleted(cartLine: CartLineModel): void {
        }

        protected addLineFailed(error: any): void {
        }

        allQtysIsValid(): boolean {
            if (!this.listModel || !this.listModel.wishListLineCollection) {
                return false;
            }

            return this.listModel.wishListLineCollection.every((wishListLine: WishListLineModel) => {
                return wishListLine.qtyOrdered && parseFloat(wishListLine.qtyOrdered.toString()) > 0;
            });
        }

        changeUnitOfMeasure(line: WishListLineModel): void {
            const product = this.wishListService.mapWishlistLineToProduct(line);
            this.productService.changeUnitOfMeasure(product).then(
                (productDto: ProductDto) => { this.changeUnitOfMeasureCompleted(line, productDto); },
                (error: any) => { this.changeUnitOfMeasureFailed(error); });
        }

        protected changeUnitOfMeasureCompleted(line: WishListLineModel, productDto: ProductDto): void {
            line = this.wishListService.mapProductToWishlistLine(productDto, line);
            if (!productDto.quoteRequired) {
                line.pricing = productDto.pricing;
            }

            this.updateLine(line);
            this.wishListService.updateAvailability(line);
        }

        protected changeUnitOfMeasureFailed(error: any): void {
        }

        deleteNote(): void {
            this.listLineNote = "";
            this.saveNote();
        }

        saveNote(): void {
            this.noteErrorMessage = "";
            if (!this.noteForm.$valid) {
                return;
            }

            this.spinnerService.show();
            this.selectedListLines[0].notes = this.listLineNote;
            this.wishListService.updateLine(this.selectedListLines[0]).then(
                (wishListLine: WishListLineModel) => { this.updateLineNoteCompleted(wishListLine); },
                (error: any) => { this.updateLineNoteFailed(error); });
        }

        protected updateLineNoteCompleted(wishListLine: WishListLineModel): void {
            this.closeModal("#popup-line-note");
            this.selectedListLines[0].notes = wishListLine.notes;
            this.spinnerService.hide();
        }

        protected updateLineNoteFailed(error: any): void {
            this.spinnerService.hide();
        }

        protected leaveList(navigateTo: string): void {
            this.wishListService.deleteWishListShare(this.listModel).then(
                (wishList: WishListModel) => { this.leaveListCompleted(navigateTo, wishList); },
                (error: any) => { this.leaveListFailed(error); });
        }

        protected leaveListCompleted(navigateTo: string, wishList: WishListModel): void {
            this.closeModal("#popup-leave-list");
            this.spinnerService.show();
            this.coreService.redirectToPath(navigateTo);
        }

        protected leaveListFailed(error: any): void {
        }

        removeProducts(productLines: WishListLineModel[]): void {
            this.spinnerService.show();
            if (productLines.length === 1) {
                this.deleteLine(productLines[0]);
            } else {
                this.deleteLines(this.listModel, productLines);
            }
        }

        hideNotVisibleProductsNotification(): void {
            this.hideNotVisibleProducts = true;
            this.notVisibleProducts = [];
        }

        openUploadListPopup(wishList: WishListModel): void {
            this.uploadToListPopupService.display(wishList);
        }

        addProductToList(productToAdd: ProductDto): void {
            if (!productToAdd || !productToAdd.id) {
                if (this.addingSearchTerm) {
                    this.setErrorMessage(angular.element("#messageNotFound").val());
                } else {
                    this.setErrorMessage(angular.element("#messageEnterProductName").val());
                }

                return;
            }

            const listLineContainsCurrentProduct = this.listModel.wishListLineCollection.filter((item) => {
                return item.productId === productToAdd.id && item.unitOfMeasure === productToAdd.selectedUnitOfMeasure;
            });

            if (listLineContainsCurrentProduct && listLineContainsCurrentProduct.length > 0) {
                this.setErrorMessage(angular.element("#alreadyInList").val());
                return;
            }

            this.isAddingToList = true;
            this.wishListService.addWishListLine(this.listModel, productToAdd).then(
                (data: WishListLineModel) => { this.addProductToListCompleted(data) },
                (error) => { this.addProductToListFailed(error) });
        }

        addProductToListCompleted(wishListLineModel: WishListLineModel) {
            this.getList();
            this.isAddingToList = false;
            this.addingSearchTerm = "";
            this.itemToAdd = null;
            this.setSuccessMessage(angular.element("#messageAddedProduct").val());
        }

        addProductToListFailed(error) {
            this.isAddingToList = false;
        }

        protected setErrorMessage(message: string) {
            this.errorMessage = message;
            this.successMessage = "";
        }

        protected setSuccessMessage(message: string) {
            this.errorMessage = "";
            this.successMessage = message;
        }

        getUomDisplayValue(uom: any): string {
            if (!uom) {
                return "";
            }

            const name = uom.description ? uom.description : uom.unitOfMeasureDisplay;
            const qtyPerBaseUnitOfMeasure = uom.qtyPerBaseUnitOfMeasure !== 1 ? "/" + uom.qtyPerBaseUnitOfMeasure : "";
            return `${name}${qtyPerBaseUnitOfMeasure}`;
        }
        
        checkPrint(event: ng.IAngularEvent): void {
            if (this.orderIsSaving) {
                event.preventDefault();
            }
        }
    }

    angular
        .module("insite")
        .controller("NbfFavoritesQuickViewController", NbfFavoritesQuickViewController);
}