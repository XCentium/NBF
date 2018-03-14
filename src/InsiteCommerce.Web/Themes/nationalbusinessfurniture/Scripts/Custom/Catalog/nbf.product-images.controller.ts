module insite.catalog {
    "use strict";

    export class NBFProductImagesController extends ProductImagesController {
        imageId: string;

        init(): void {
            alert("img");
            this.$scope.$watch(() => this.product.productImages, () => {
                if (this.product.productImages.length > 0) {
                    this.selectedImage = this.product.productImages[0];
                } else {
                    this.selectedImage = {
                        smallImagePath: this.product.smallImagePath,
                        mediumImagePath: this.product.mediumImagePath,
                        largeImagePath: this.product.largeImagePath,
                        altText: this.product.altText
                    } as ProductImageDto;
                }
            }, true);

            this.imageId = this.product.productImages.smallImagePath;
            (angular.element("#imgZoom") as any).foundation("reveal");

            angular.element(document).on("close.fndtn.reveal", "#imgZoom[data-reveal]:visible", () => { this.onImgZoomClose(); });

            angular.element(document).on("opened.fndtn", "#imgZoom[data-reveal]", () => { this.onImgZoomOpened(); });
        }

        productZoom() {
            window.console.log(this.imageId);
        }

        protected onImgZoomClose(): void {
            this.$scope.$apply(() => {
                this.showCarouselOnZoomModal = false;
            });
        }

        protected onImgZoomOpened(): void {
            this.$scope.$apply(() => {
                this.showCarouselOnZoomModal = true;
            });
            window.console.log(this.imageId);
            jQuery($ => {
                var flyoutViewer = new s7viewers.FlyoutViewer();
                {
                    flyoutViewer.setContainerId("s7viewer-test");
                    flyoutViewer.setParam("asset", this.imageId);
                    flyoutViewer.setParam("serverurl", "https://s7d9.scene7.com/is/image/");
                    flyoutViewer.setParam("contenturl", "https://s7d9.scene7.com/skins/");
                    flyoutViewer.setParam("autoResize", "1");
                    flyoutViewer.setParam("overlay", "1");
                    flyoutViewer.setParam("config", "Viewers/HTML5_Inline_FlyoutZoom");
                    flyoutViewer.init();
                }
            });
        }

        getMainImageWidth(): number {
            return angular.element(`#${this.mainPrefix}ProductImage`).outerWidth();
        }

        getZoomImageWidth(): number {
            return angular.element(`#${this.zoomPrefix}ProductImage`).outerWidth();
        }
    }

    angular
        .module("insite")
        .controller("NBFProductImagesController", ProductImagesController);
}