module nbf.Footer {
    "use strict";

    export class NbfFooterController {
        public WebCode: string = "";

        static $inject = ["$rootScope"];
        constructor(
            protected $rootScope: ng.IRootScopeService
            ) {
            this.init();
            var self = this;
            $rootScope.$on("WebCodeComplete", (event, webcode) => {
                self.WebCode = webcode;
            });
        }

        init(): void {
            $('.footer-nav__group__title').on('click', function (e) {
                e.preventDefault();
                var p = $(this).parent();
                if (p.hasClass('open')) {
                    p.removeClass('open');
                } else {
                    p.addClass('open');
                }
            });
        }

        
    }

    angular
        .module("insite")
        .controller("NbfFooterController", NbfFooterController);
}