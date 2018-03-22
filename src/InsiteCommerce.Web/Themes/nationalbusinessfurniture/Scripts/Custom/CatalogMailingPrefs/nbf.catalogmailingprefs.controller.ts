module nbf.CatalogMailingPrefs {
    "use strict";

    export class NbfCatalogMailingPrefsController {      
        form: any = {};
        submitted: boolean = false;
        static $inject = ["$scope", "nbfCatalogMailingPrefsService"];

        constructor(
            protected $scope: ng.IScope,
            protected nbfCatalogMailingPrefsService: CatalogMailingPrefs.INbfCatalogMailingPrefsService) {
            this.init();
        }

        init(): void {
        }

        sendEmail(): void
        {
            this.nbfCatalogMailingPrefsService.sendEmail(this.form).then(
                (catalogMailingPrefs: string) => {
                    this.getCatalogMailingPrefsCompleted(catalogMailingPrefs);
                    this.submitted = true;
                },
                (error: any) => { this.getCatalogMailingPrefsFailed(error); });
            
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