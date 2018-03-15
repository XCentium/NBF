﻿//import ProductImageDto = Insite.Catalog.Services.Dtos.ProductImageDto;

module insite.catalog {
    "use strict";

    export class NbfProductImageCarouselController extends ProductImageCarouselController {
        //maxTries: number;
        //productImages: ProductImageDto[];
        //selectedImage: ProductImageDto;
        //imagesLoaded: number;
        //carousel: any;
        //prefix: string;
        //getCarouselWidth: () => number;
        //carouselWidth: number;

        //static $inject = ["$timeout", "$scope"];

        //constructor(protected $timeout: ng.ITimeoutService, protected $scope: ng.IScope) {
        //    this.init();
        //}

        //init(): void {
        //    this.imagesLoaded = 0;
        //    this.waitForDom(this.maxTries);
        //}

        //protected waitForDom(tries: number): void {
        //    if (isNaN(+tries)) {
        //        tries = this.maxTries || 1000; // Max 20000ms
        //    }

        //    // If DOM isn't ready after max number of tries then stop
        //    if (tries > 0) {
        //        this.$timeout(() => {
        //            if (this.isCarouselDomReadyAndImagesLoaded()) {
        //                this.initializeCarousel();
        //                this.$scope.$apply();
        //            } else {
        //                this.waitForDom(tries - 1);
        //            }
        //        }, 20, false);
        //    }
        //}

        //protected isCarouselDomReadyAndImagesLoaded(): boolean {
        //    return $(`#${this.prefix}-img-carousel`).length > 0 && this.productImages
        //        && this.imagesLoaded >= this.productImages.length;
        //}

        protected initializeCarousel(): void {
            $(`#${this.prefix}-img-carousel`).flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: false,
                animationSpeed: 200,
                itemWidth: 120,
                itemMargin: 10,
                move: 1,
                customDirectionNav: $(`.${this.prefix}-carousel-control-nav`),
                start: (slider: any) => { this.onSliderStart(slider); }
            });

            $(window).resize(() => { this.onWindowResize(); });
        }

        //protected onSliderStart(slider: any): void {
        //    this.carousel = slider;
        //    this.carouselWidth = this.getCarouselWidth();
        //    this.reloadCarousel();
        //}

        //protected onWindowResize(): void {
        //    const currentCarouselWidth = this.getCarouselWidth();
        //    if (currentCarouselWidth && this.carouselWidth !== currentCarouselWidth) {
        //        this.carouselWidth = currentCarouselWidth;
        //        this.reloadCarousel();
        //        $(`#${this.prefix}-img-carousel`).data("flexslider").flexAnimate(0);
        //    }
        //}

        //protected reloadCarousel(): void {
        //    const itemsNum = Math.floor((this.carouselWidth + this.carousel.vars.itemMargin) / (this.carousel.vars.itemWidth + this.carousel.vars.itemMargin));
        //    this.showImageCarouselArrows(this.carousel.count > itemsNum);
        //    const carouselWidth = (this.carousel.vars.itemWidth + this.carousel.vars.itemMargin) * this.carousel.count - this.carousel.vars.itemMargin;
        //    $(`#${this.prefix}-img-carousel-wrapper`).css("width", carouselWidth).css("max-width", this.carouselWidth).css("visibility", "visible").css("position", "relative");

        //    // this line should be there because of a flexslider issue (https://github.com/woocommerce/FlexSlider/issues/1263)
        //    $(`#${this.prefix}-img-carousel`).resize();
        //}

        //protected showImageCarouselArrows(shouldShowArrows: boolean): void {
        //    if (shouldShowArrows) {
        //        $(`.${this.prefix}-carousel-control-nav`).show();
        //    } else {
        //        $(`.${this.prefix}-carousel-control-nav`).hide();
        //    }
        //}

        //selectImage(image: ProductImageDto): void {
        //    this.selectedImage = image;
        //    this.$timeout(() => {
        //        this.reloadCarousel();
        //    }, 20);
        //}
    }

    angular
        .module("insite")
        .controller("ProductImageCarouselController", NbfProductImageCarouselController);
}