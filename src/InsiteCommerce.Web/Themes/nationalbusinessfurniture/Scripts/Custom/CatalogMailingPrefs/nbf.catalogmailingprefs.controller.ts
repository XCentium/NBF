module nbf.CatalogMailingPrefs {
    "use strict";

    export interface INbfCatalogMailingPrefsControllerAttributes extends ng.IAttributes {
        redirectUrl: string;
    }

    export class NbfCatalogMailingPrefsController {      
        catalogPrefs: any = {};
        submitted: boolean = false;
        $form: JQuery;
        static $inject = ["$element", "$scope", "$window", "nbfEmailService", "$attrs"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected nbfEmailService: email.INbfEmailService,
            protected $attrs: INbfCatalogMailingPrefsControllerAttributes) {
            this.init();
        }

        init(): void {
        }

        sendEmail($event): boolean
        {
            const valid = angular.element("#catalogMailingPrefsForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);
                return;
            }
            
            this.nbfEmailService.sendCatalogPrefsEmail(this.catalogPrefs).then(
                (catalogMailingPrefs: string) => {
                    this.getCatalogMailingPrefsCompleted(catalogMailingPrefs);
                    this.submitted = true;

                    this.$window.location.href = this.$attrs.redirectUrl;
                },
                (error: any) => { this.getCatalogMailingPrefsFailed(error); });

            return false;
        }

        protected getCatalogMailingPrefsCompleted(catalogMailingPrefs: string): void {
            //if (this.catalogPrefsForm) {
            //    this.catalogPrefsForm.$setPristine();
            //} 
        }

        protected getCatalogMailingPrefsFailed(error?: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfCatalogMailingPrefsController", NbfCatalogMailingPrefsController);
}