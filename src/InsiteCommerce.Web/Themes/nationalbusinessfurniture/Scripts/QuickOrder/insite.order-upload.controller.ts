module insite.quickorder {
    "use strict";

    enum UploadError {
        None,
        NotEnough,
        ConfigurableProduct,
        StyledProduct,
        Unavailable,
        InvalidUnit,
        NotFound,
        OutOfStock
    }

    export class OrderUploadController {
        fileName: string = null;
        file: any = null;
        XLSX: any;
        Papa: any;
        firstRowHeading = false;
        badFile = false;
        uploadLimitExceeded = false;
        uploadCancelled = false;
        allowCancel = true;
        productRequests: ng.IPromise<ProductCollectionModel>[];

        errorProducts: any[] = null;
        products: ProductDto[];
        bulkSearch: any = null;
        uploadedItemsCount = 0;
        totalProductToProcess: number;
        productProcessed: number;

        static $inject = ["$scope", "productService", "cartService", "coreService"];

        constructor(
            protected $scope: ng.IScope,
            protected productService: catalog.IProductService,
            protected cartService: cart.ICartService,
            protected coreService: core.ICoreService) {
            this.init();
        }

        init(): void {
            this.XLSX = XLSX;
            this.Papa = Papa;

            angular.element("#hiddenFileUpload").data("_scope", this.$scope);
        }

        protected showOrderUploadSuccessPopup(): void {
            const $popup = angular.element("#orderUploadSuccessPopup");
            if ($popup.length > 0) {
                this.coreService.displayModal($popup);
            }
        }

        onButtonFileUploadClick(): void {
            $("#hiddenFileUpload").val(null).click();
        }

        hideOrderUploadSuccessPopup(): void {
            this.coreService.closeModal("#orderUploadSuccessPopup");
        }

        setFile(arg): void {
            if (arg.files.length > 0) {
                this.file = arg.files[0];
                this.fileName = this.file.name;
                const fileExtension = this.getFileExtension(this.file.name);
                this.badFile = ["xls", "xlsx", "csv"].indexOf(fileExtension) === -1;
                this.uploadLimitExceeded = false;

                setTimeout(() => {
                    this.$scope.$apply();
                });
            }
        }

        uploadFile(): void {
            this.uploadCancelled = false;

            const f = this.file;
            const reader = new FileReader();
            const fileExtension = this.getFileExtension(f.name);

            reader.onload = this.onReaderLoad(fileExtension);

            reader.readAsArrayBuffer(f);
        }

        protected onReaderLoad(fileExtension: string) {
            return (e: Event) => {
                const data = (e.target as any).result;
                const arr = this.fixData(data);
                try {
                    if (fileExtension === "xls" || fileExtension === "xlsx") {
                        const wb = this.XLSX.read(btoa(arr), { type: "base64" });
                        if (wb) {
                            this.processWb(wb);
                        }
                    } else if (fileExtension === "csv") {
                        this.processCsv(arr);
                    } else {
                        this.badFile = true;
                    }
                } catch (error) {
                    this.badFile = true;
                }

                if (!this.badFile && !this.uploadLimitExceeded) {
                    this.allowCancel = true;
                    this.coreService.displayModal(angular.element("#orderUploadingPopup"));
                } else {
                    this.$scope.$apply();
                }
            };
        }

        protected processWb(wb): void {
            this.bulkSearch = [];
            wb.SheetNames.forEach((sheetName) => {
                const opts = { header: 1 };
                let roa = this.XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName], opts);
                if (roa.length > 0) {
                    if (this.firstRowHeading) {
                        roa = roa.slice(1, roa.length);
                    }
                    roa = roa.filter(r => { return r[0] != null && r[0].length > 0; });
                    if (this.limitExceeded(roa.length)) {
                        return;
                    }
                    this.bulkSearch = roa.map(r => {
                        const obj = { Name: r[0], Qty: r[1], UM: r[2] };
                        return obj;
                    });
                }
            });
            this.bulkSearchProducts();
        }

        protected processCsv(data: string): void {
            this.bulkSearch = [];
            const newLineIndex = data.lastIndexOf("\r\n");
            if (newLineIndex + 2 === data.length) {
                data = data.substr(0, newLineIndex);
            }
            const results = Papa.parse(data);
            if (results.errors.length > 0) {
                this.badFile = true;
                return;
            }
            let rows = results.data;
            if (this.firstRowHeading) {
                rows = rows.slice(1, rows.length);
            }
            if (this.limitExceeded(rows.length)) {
                return;
            }
            rows.forEach((s) => {
                if (s[0] == null || s[0].length === 0) {
                    return;
                }
                const objectToAdd: any = {};
                objectToAdd.Name = s[0];
                if (s[1]) {
                    objectToAdd.Qty = s[1];
                }
                if (s[2]) {
                    objectToAdd.UM = s[2];
                }
                this.bulkSearch.push(objectToAdd);
            });
            this.bulkSearchProducts();
        }

        protected bulkSearchProducts(): void {
            this.productRequests = [];
            this.errorProducts = [];
            this.products = [];
            this.totalProductToProcess = this.bulkSearch.length;
            this.productProcessed = 0;

            if (this.totalProductToProcess === 0) {
                this.badFile = true;
                return;
            }

            this.bulkSearch.forEach((item, i) => {
                const index = i + (this.firstRowHeading ? 2 : 1);
                const parameter: catalog.IProductCollectionParameters = { extendedNames: [item.Name] } as any;
                const expandParameter = ["pricing"];
                const request = this.productService.getProducts(parameter, expandParameter);
                this.productRequests.push(request as any);

                request.then(
                    (productCollection: ProductCollectionModel) => { this.getProductsCompleted(productCollection, item, index); },
                    (error: any) => { this.getProductsFailed(error, item, index); });
            });
        }

        protected getDefaultProductUnitOfMeasureDto(): ProductUnitOfMeasureDto {
            return {
                productUnitOfMeasureId: "",
                unitOfMeasure: "",
                unitOfMeasureDisplay: "",
                description: "",
                qtyPerBaseUnitOfMeasure: 1,
                roundingRule: "",
                isDefault: false,
                availability: null
            };
        }

        protected getBaseUnitOfMeasure(product: ProductDto): ProductUnitOfMeasureDto {
            const defaultUnitOfMeasure = this.getDefaultProductUnitOfMeasureDto();

            let baseUnitOfMeasure = product.productUnitOfMeasures.filter(u => u.isDefault)[0];
            if (!baseUnitOfMeasure) {
                baseUnitOfMeasure = defaultUnitOfMeasure;
            }

            return baseUnitOfMeasure;
        }

        protected getCurrentUnitOfMeasure(product: ProductDto): ProductUnitOfMeasureDto {
            const defaultUnitOfMeasure = this.getDefaultProductUnitOfMeasureDto();

            let currentUnitOfMeasure = product.productUnitOfMeasures.filter(u => u.unitOfMeasure === product.unitOfMeasure)[0];
            if (!currentUnitOfMeasure) {
                currentUnitOfMeasure = defaultUnitOfMeasure;
            }

            return currentUnitOfMeasure;
        }

        protected getProductUnitOfMeasures(product: ProductDto, item: any): ProductUnitOfMeasureDto[] {
            const lowerCaseItemUm = item.UM ? item.UM.toLowerCase() : "";

            return lowerCaseItemUm ? product.productUnitOfMeasures.filter(u => u.unitOfMeasure.toLowerCase() === lowerCaseItemUm
                || u.unitOfMeasureDisplay.toLowerCase() === lowerCaseItemUm
                || u.description.toLowerCase() === lowerCaseItemUm) : [];
        }

        protected setProductUnitOfMeasure(product: ProductDto, item: any, index: any): boolean {
            const uoms = this.getProductUnitOfMeasures(product, item);

            if (uoms.length > 0) {
                const um = uoms[0];
                product.selectedUnitOfMeasure = um.unitOfMeasure;
                product.selectedUnitOfMeasureDisplay = um.unitOfMeasureDisplay;
                product.unitOfMeasure = um.unitOfMeasure;
                product.unitOfMeasureDisplay = um.unitOfMeasureDisplay;

                return false;
            } else if (item.UM) {
                const errorProduct = this.mapProductErrorInfo(index, UploadError.InvalidUnit, item.Name, product);
                errorProduct.umRequested = item.UM;
                this.errorProducts.push(errorProduct);

                return true;
            }

            return false;
        }

        protected addProductToList(product: ProductDto, item: any, index: any): void {
            const baseUnitOfMeasure = this.getBaseUnitOfMeasure(product);
            const currentUnitOfMeasure = this.getCurrentUnitOfMeasure(product);

            if (product.trackInventory && !product.canBackOrder && !product.quoteRequired && baseUnitOfMeasure && currentUnitOfMeasure &&
                    product.qtyOrdered * baseUnitOfMeasure.qtyPerBaseUnitOfMeasure > product.qtyOnHand * currentUnitOfMeasure.qtyPerBaseUnitOfMeasure) {
                const errorProduct = this.mapProductErrorInfo(index, UploadError.NotEnough, item.Name, product);
                errorProduct.conversionRequested = currentUnitOfMeasure.qtyPerBaseUnitOfMeasure;
                errorProduct.conversionOnHands = baseUnitOfMeasure.qtyPerBaseUnitOfMeasure;
                errorProduct.umOnHands = baseUnitOfMeasure.unitOfMeasureDisplay;
                this.errorProducts.push(errorProduct);
            }

            this.products.push(product);
        }

        protected getProductsCompleted(productCollection: ProductCollectionModel, item: any, index: any): void {
            if (this.uploadCancelled) {
                return;
            }

            const products = productCollection.products;

            if (products && products.length === 1) {
                const product = products[0];
                const error = this.validateProduct(product);

                if (error === UploadError.None) {
                    product.qtyOrdered = !item.Qty ? 1 : item.Qty;

                    const isErrorProduct = this.setProductUnitOfMeasure(product, item, index);

                    if (!isErrorProduct) {
                        this.addProductToList(product, item, index);
                    }
                } else {
                    this.errorProducts.push(this.mapProductErrorInfo(index, error, item.Name, product));
                }
            } else {
                this.errorProducts.push(this.mapProductErrorInfo(index, UploadError.NotFound, item.Name, <ProductDto>{
                    qtyOrdered: item.Qty,
                    unitOfMeasureDisplay: item.UM
                }));
            }

            this.checkCompletion();
        }

        protected getProductsFailed(error: any, item: any, index: any): void {
            if (error.status === 404) {
                this.errorProducts.push(this.mapProductErrorInfo(index, UploadError.NotFound, item.Name, <ProductDto>{
                    qtyOrdered: item.Qty,
                    unitOfMeasureDisplay: item.UM
                }));
                this.checkCompletion();
            }
        }

        protected checkCompletion(): void {
            this.productProcessed++;

            if (!this.uploadCancelled && this.productProcessed === this.totalProductToProcess) {
                if (this.bulkSearch.length === this.products.length && this.errorProducts.length === 0) {
                    this.continueToCart();
                } else {
                    this.coreService.closeModal("#orderUploadingPopup");
                    setTimeout(() => {
                        this.coreService.displayModal(angular.element("#orderUploadingIssuesPopup"));
                    }, 250); // Foundation.libs.reveal.settings.animation_speed
                }
            }
        }

        protected validateProduct(product: ProductDto): UploadError {
            if (product.qtyOnHand === 0 && product.trackInventory && !product.canBackOrder) {
                return UploadError.OutOfStock;
            }

            if (product.canConfigure || (product.isConfigured && !product.isFixedConfiguration)) {
                return UploadError.ConfigurableProduct;
            }

            if (product.isStyleProductParent) {
                return UploadError.StyledProduct;
            }

            if (!product.canAddToCart) {
                return UploadError.Unavailable;
            }

            return UploadError.None;
        }

        protected fixData(data): string {
            let o = "";
            let l = 0;
            const w = 10240;

            for (; l < data.byteLength / w; ++l) {
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
            }

            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

            return o;
        }

        cancelUpload(): void {
            this.uploadCancelled = true;
            this.coreService.closeModal("#orderUploadingPopup");

            if (!this.productRequests) {
                return;
            }

            for (let i = 0; i < this.productRequests.length; i++) {
                (this.productRequests[i] as any).cancel();
            }

            this.cleanupUploadData();
            this.fileName = null;
            this.file = null;
        }

        closeIssuesPopup(): void {
            this.coreService.closeModal("#orderUploadingIssuesPopup");
            this.cleanupUploadData();
        }

        continueToCart(popupSelector?: string): void {
            if (popupSelector) {
                this.coreService.closeModal(popupSelector);
            }

            this.allowCancel = false;

            setTimeout(() => {
                this.coreService.displayModal(angular.element("#orderUploadingPopup"));
            }, 250);

            this.cartService.addLineCollectionFromProducts(this.products, true, false).then(
                (cartLineCollection: CartLineCollectionModel) => { this.addLineCollectionFromProductsCompleted(cartLineCollection); },
                (error: any) => { this.addLineCollectionFromProductsFailed(error); });
        }

        protected addLineCollectionFromProductsCompleted(cartLineCollection: CartLineCollectionModel): void {
            this.coreService.closeModal("#orderUploadingPopup");
            this.uploadedItemsCount = this.products.length;

            setTimeout(() => {
                this.showOrderUploadSuccessPopup();
                this.cleanupUploadData();
            }, 250);
        }

        protected addLineCollectionFromProductsFailed(error: any): void {
        }

        protected getFileExtension(fileName: string): string {
            const splitFileName = fileName.split(".");
            return splitFileName.length > 0 ? splitFileName[splitFileName.length - 1].toLowerCase() : "";
        }

        protected cleanupUploadData(): void {
            this.productRequests = null;
            this.errorProducts = null;
            this.products = null;
        }

        protected mapProductErrorInfo(index: number, error: UploadError, name: string, product: ProductDto): any {
            return {
                index: index,
                error: UploadError[error],
                name: name,
                qtyRequested: product.qtyOrdered,
                umRequested: product.unitOfMeasureDisplay,
                qtyOnHands: product.qtyOnHand
            };
        }

        protected limitExceeded(rowsCount: number): boolean {
            this.uploadLimitExceeded = rowsCount > 500;
            return this.uploadLimitExceeded;
        }
    }

    angular
        .module("insite")
        .controller("OrderUploadController", OrderUploadController);
}