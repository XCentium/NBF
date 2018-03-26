module insite.catalog {
    "use strict";

    export class NbfCrossSellCarouselController extends CrossSellCarouselController {

        protected initializeCarousel(): void {
            $(".cs-carousel").flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: false,
                itemWidth: this.getItemSize(),
                minItems: this.getItemsNumber(),
                maxItems: this.getItemsNumber(),
                itemMargin: 36,
                move: this.getItemsMove(),
                controlsContainer: $(".custom-controls-container"),
                customDirectionNav: $(".carousel-control-nav"),
                start: (slider: any) => { this.onCarouselStart(slider); }
            });

            $(window).resize(() => { this.onWindowResize(); });
        }

        protected isAttributeValue(product: ProductDto, attrName: string, attrValue: string): boolean {
            let retVal = false;

            if (product && product.attributeTypes) {
                const attrType = product.attributeTypes.find(x => x.name === attrName && x.isActive === true);

                if (attrType) {
                    const matchingAttrValue = attrType.attributeValues.find(y => y.value === attrValue);

                    if (matchingAttrValue) {
                        retVal = true;
                    }
                }
            }
            return retVal;
        }

    }

    angular
        .module("insite")
        .controller("CrossSellCarouselController", NbfCrossSellCarouselController);
}