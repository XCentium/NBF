//import ProductImageDto = Insite.Catalog.Services.Dtos.ProductImageDto;


module insite.catalog {
    "use strict";
    export class NbfProductImageCarouselController extends ProductImageCarouselController {

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

        protected reloadCarousel(): void {
            const itemsNum = Math.floor((this.carouselWidth + this.carousel.vars.itemMargin) / (this.carousel.vars.itemWidth + this.carousel.vars.itemMargin));
            this.showImageCarouselArrows(this.carousel.count > 4);
            const carouselWidth = (this.carousel.vars.itemWidth + this.carousel.vars.itemMargin) * this.carousel.count - this.carousel.vars.itemMargin;
            $(`#${this.prefix}-img-carousel-wrapper`)/*.css("width", carouselWidth).css("max-width", this.carouselWidth)*/.css("visibility", "visible").css("position", "relative");

            // this line should be there because of a flexslider issue (https://github.com/woocommerce/FlexSlider/issues/1263)
            $(`#${this.prefix}-img-carousel`).resize();
        }

        protected showImageCarouselArrows(shouldShowArrows: boolean): void {
            if (shouldShowArrows) {
                $(`.${this.prefix}-carousel-control-nav`).show();
            } else {
                $(`.${this.prefix}-carousel-control-nav`).hide();
            }
        }

        selectImage(image: ProductImageDto): void {
            this.selectedImage = image;
            document.getElementById("s7flyout_inline_div").innerHTML = '';

            this.scene7InitWith(this.selectedImage.name);

            $('#s7flyout_inline_div').show();
            $('#Wrapper360').hide();
            var myVideo = $('#videofile');
            if (myVideo) {
                myVideo.trigger('pause');
            }
            $('#videofile').hide();
            this.$timeout(() => {
                this.reloadCarousel();
            }, 20);
        }

        scene7InitWith(imageName: string) {
            var imageID = 'NationalBusinessFurniture/' + imageName + '?wid=600';
            var flyoutViewer = new s7viewers.FlyoutViewer();
            {
                flyoutViewer.setContainerId("s7flyout_inline_div");
                flyoutViewer.setParam("asset", imageID);
                flyoutViewer.setParam("serverurl", "https://s7d9.scene7.com/is/image/");
                flyoutViewer.setParam("contenturl", "https://s7d9.scene7.com/skins/");
                flyoutViewer.setParam("autoResize", "1");
                flyoutViewer.setParam("overlay", "1");
                flyoutViewer.setParam("config", "Viewers/HTML5_Inline_FlyoutZoom");

                flyoutViewer.init();
                flyoutViewer.setAsset(imageID);
            }
        }
    }

    angular
        .module("insite")
        .controller("ProductImageCarouselController", NbfProductImageCarouselController);
}