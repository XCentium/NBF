﻿module nbf.ShopTheLook {
    "use strict";

    export class NbfShopTheLookLandingViewController {
        collection: ShopTheLookCollection;

        static $inject = [
            "nbfShopTheLookService",
            "spinnerService"
        ];

        constructor(protected nbfShopTheLookService: ShopTheLook.INbfShopTheLookService,
            protected spinnerService: insite.core.SpinnerService) {
            this.init();
        }

        init(): void {
            $(".shopthelook__dropdown").on("click", function (e) {
                e.preventDefault();
                var p = $(this);
                if (p.hasClass("open")) {
                    p.removeClass("open");
                } else {
                    p.addClass("open");
                }
            });

            // change is-checked class on buttons
            $(".button-group").each((i, buttonGroup) => {
                var $buttonGroup = $(buttonGroup);
                $buttonGroup.on("click",
                    "button",
                    function () {
                        $buttonGroup.find(".is-checked").removeClass("is-checked");
                        $(this).addClass("is-checked");
                    });
            });

            this.nbfShopTheLookService.getLooks().then((result) => {
                this.collection = result;
                this.mapFilters();
                
                setTimeout(() => {
                        var $grid = $(".shopthelook__gird").isotope({
                            itemSelector: ".grid-item",
                            masonry: {
                                horizontalOrder: true,
                                gutter: ".gutter-sizer",
                            }
                        });

                        // bind filter button click
                        $(".shopthelook__filter-group").on("click",
                            "button",
                            function () {
                                var filterValue = $(this).attr("data-filter");
                                // use filterFn if matches value
                                $grid.isotope({ filter: filterValue });
                        });
                    },
                    1000);
            });
        }

        private mapFilters() {
            this.collection.categories.forEach(cat => {
                cat.lookIds.forEach(id => {
                    var look = this.collection.looks.filter(x => x.id === id)[0];
                    if (look) {
                        if (!look.categoryIds) {
                            look.categoryIds = [];
                        }
                        look.categoryIds.push(cat.id);
                    }
                });
            });

            this.collection.styles.forEach(style => {
                style.lookIds.forEach(id => {
                    var look = this.collection.looks.filter(x => x.id === id)[0];
                    if (look) {
                        if (!look.styleNames) {
                            look.styleNames = [];
                        }
                        look.styleNames.push(style.styleName.replace(/\s/g, ""));
                    }
                });
            });
        }
    }

    angular
        .module("insite")
        .filter("removeSpaces", () => (text: string) => {
            return text.replace(/\s/g, "");
        })
        .controller("NbfShopTheLookLandingViewController", NbfShopTheLookLandingViewController);
}