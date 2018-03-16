module insite.catalog {
    "use strict";

    export class NBFProductImagesController extends ProductImagesController {


        init(): void {
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
                scene7.scene7InitWith(this.selectedImage.smallImagePath);
            }, true);
            
            (angular.element("#imgZoom") as any).foundation("reveal");

            angular.element(document).on("close.fndtn.reveal", "#imgZoom[data-reveal]:visible", () => { this.onImgZoomClose(); });

            angular.element(document).on("opened.fndtn", "#imgZoom[data-reveal]", () => { this.onImgZoomOpened(); });
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
        .filter('trusted', ['$sce', function ($sce) {
            return function (url) {
                return $sce.trustAsResourceUrl(url);
            };
        }])
        .controller("ProductImagesController", NBFProductImagesController);
}