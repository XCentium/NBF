module nbf.ShopTheLook {
    "use strict";

    export class NbfShopTheLookLandingViewController {
        collection: ShopTheLookCollection;
        selectedStyles: ShopTheLookStyle[];
        selectedRooms: ShopTheLookCategory[];
        filteredRooms: ShopTheLookCategory[];
        $grid: any;

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
                const p = $(this);
                if (p.hasClass("open")) {
                    p.removeClass("open");
                } else {
                    p.addClass("open");
                }
            });
            
            this.nbfShopTheLookService.getLooks().then((result) => {
                this.collection = result;
                this.selectedRooms = [];
                this.selectedStyles = [];
                this.filteredRooms = this.collection.categories;
                this.mapFilters();

                setTimeout(() => {
                    this.$grid = $(".shopthelook__gird").isotope({
                        itemSelector: ".grid-item",
                        masonry: {
                            horizontalOrder: true,
                            gutter: ".gutter-sizer",
                        }
                    });
                }, 1000);
            });
        }

        showAllStyles() {
            $("#filter1 button").removeClass("is-checked");
            $("#filter1 .show-all").addClass("is-checked");
            this.selectedStyles = [];
            this.filteredRooms = this.collection.categories;
            this.runIsotope();
        }

        showAllRooms() {
            $("#filter2 button").removeClass("is-checked");
            $("#filter2 .show-all").addClass("is-checked");
            this.selectedRooms = [];
            this.runIsotope();
        }

        filterStyle($event, style: ShopTheLookStyle) {
            $("#filter1 .show-all").removeClass("is-checked");

            const index = this.selectedStyles.indexOf(style, 0);
            if (index > -1) {
                angular.element($event.target).removeClass("is-checked");
                this.selectedStyles.splice(index, 1);
                if (this.selectedStyles.length === 0) {
                    this.showAllStyles();
                } else {
                    this.filterRooms();
                    this.runIsotope();
                }
            } else {
                angular.element($event.target).addClass("is-checked");
                this.selectedStyles.push(style);
                this.filterRooms();
                this.runIsotope();
            }
        }

        filterRoom($event, room: ShopTheLookCategory) {
            $("#filter2 .show-all").removeClass("is-checked");

            const index = this.selectedRooms.indexOf(room, 0);
            if (index > -1) {
                angular.element($event.target).removeClass("is-checked");
                this.selectedRooms.splice(index, 1);
                if (this.selectedRooms.length === 0) {
                    this.showAllRooms();
                } else {
                    this.runIsotope(); 
                }
            } else {
                angular.element($event.target).addClass("is-checked");
                this.selectedRooms.push(room);
                this.runIsotope();
            }
        }

        private filterRooms() {
            this.filteredRooms = [];
            var lookIds = [];
            this.selectedStyles.forEach((style) => {
                lookIds.push.apply(lookIds, style.lookIds);
            });

            this.collection.categories.forEach((cat) => {
                lookIds.forEach((id) => {
                    if (cat.lookIds.indexOf(id) > -1) {
                        if (this.filteredRooms.indexOf(cat) === -1) {
                            this.filteredRooms.push(cat);
                        }
                    }
                });
            });

            this.selectedRooms.forEach((room) => {
                if (this.filteredRooms.indexOf(room) === -1) {
                    this.showAllRooms();
                }
            });
        }

        private runIsotope() {
            var styleFilterString = "";
            this.selectedStyles.forEach((style, i) => {
                if (i !== 0) {
                    styleFilterString += ", ";
                }
                if (this.selectedRooms.length > 0) {
                    this.selectedRooms.forEach((room, i) => {
                        if (i !== 0) {
                            styleFilterString += ", ";
                        }
                        styleFilterString += `.${style.styleName.replace(/\s/g, "")}.${room.id}`;
                    });
                } else {
                    styleFilterString += `.${style.styleName.replace(/\s/g, "")}`;
                }
            });

            var roomFilterString = "";
            if (this.selectedStyles.length === 0) {
                this.selectedRooms.forEach((room, i) => {
                    if (i !== 0 || styleFilterString) {
                        roomFilterString += ", ";
                    }
                    roomFilterString += `.${room.id}`;
                });
            }

            const filters = styleFilterString + roomFilterString;
            console.dir(filters);
            this.$grid.isotope({ filter: filters });
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