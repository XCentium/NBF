module nbf.shopthelook {
    "use strict";

    export class NbfShopTheLookLandingViewController {
        looks: ShopTheLook.ShopTheLookCollection;

        static $inject = [
            "nbfShopTheLookService"
        ];

        constructor(protected nbfShopTheLookService: ShopTheLook.INbfShopTheLookService) {
            this.init();
        }

        init(): void {
            this.runJavascript();
            this.nbfShopTheLookService.getLooks().then((result) => {
                this.looks = result;
            });
        }

        private runJavascript() {
            var self = this;

            $(".shopthelook__dropdown").on("click", function (e) {
                e.preventDefault();
                var p = $(this);
                if (p.hasClass("open")) {
                    p.removeClass("open");
                } else {
                    p.addClass("open");
                }
            });

            $(document).ready(() => {
                var $grid = $(".shopthelook__gird").isotope({
                    itemSelector: ".grid-item",
                    masonry: {
                        horizontalOrder: true,
                        gutter: ".gutter-sizer",
                    }
                });

                // bind filter button click
                $(".shopthelook__filter-group").on("click", "button", function () {
                    var filterValue = $(this).attr("data-filter");
                    // use filterFn if matches value
                    $grid.isotope({ filter: filterValue });
                });

                // change is-checked class on buttons
                $(".button-group").each((i, buttonGroup) => {
                    var $buttonGroup = $(buttonGroup);
                    $buttonGroup.on("click", "button", function () {
                        $buttonGroup.find(".is-checked").removeClass("is-checked");
                        $(this).addClass("is-checked");
                    });
                });
            });
        }



    }

    angular
        .module("insite")
        .controller("NbfShopTheLookLandingViewController", NbfShopTheLookLandingViewController);
}