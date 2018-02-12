module nbf.Footer {
    "use strict";

    export class NbfFooterController {
        

        constructor(
            ) {
            this.init();
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