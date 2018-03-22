module nbf.CatalogMailingPrefs {
    "use strict";

    export class NbfCatalogMailingPrefsController {      
        catalogPrefs: any = {};
        submitted: boolean = false;
        $form: JQuery;
        static $inject = ["$element", "$scope", "nbfCatalogMailingPrefsService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected nbfCatalogMailingPrefsService: CatalogMailingPrefs.INbfCatalogMailingPrefsService) {
            this.init();
        }

        init(): void {
            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);
        }

        sendEmail($event): boolean
        {
            $event.preventDefault();

            if (!this.$form.valid()) {
                return false;
            }            
            this.nbfCatalogMailingPrefsService.sendEmail(this.catalogPrefs).then(
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