module nbf.CatalogMailingPrefs {
    "use strict";

    export class NbfCatalogMailingPrefsController {      
        catalogPrefs: any = {};
        submitted: boolean = false;
        $form: JQuery;
        static $inject = ["$element", "$scope", "nbfEmailService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected nbfEmailService: email.INbfEmailService) {
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