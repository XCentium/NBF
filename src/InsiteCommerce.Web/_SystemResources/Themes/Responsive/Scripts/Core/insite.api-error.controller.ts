module insite.core {
    "use strict";

    export class ApiErrorPopupController {
        errorMessage: string;

        static $inject = ["$scope", "coreService", "apiErrorPopupService"];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: ICoreService,
            protected apiErrorPopupService: IApiErrorPopupService) {
            this.init();
        }

        init(): void {
            this.apiErrorPopupService.registerDisplayFunction((data: any) => {
                const $popup = angular.element(".api-error-popup");
                if ($popup.length > 0) {
                    this.errorMessage = JSON.stringify(data, null, "<br/>");
                    this.coreService.displayModal($popup);
                }
            });
        }
    }

    export interface IApiErrorPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class ApiErrorPopupService extends base.BasePopupService<any> implements IApiErrorPopupService {
        init(): void {
            this.$rootScope.$on("displayApiErrorPopup", (event, data) => {
                this.display(data);
            });
        }

        protected getDirectiveHtml(): string {
            return "<isc-api-error-popup></isc-api-error-popup>";
        }
    }

    angular
        .module("insite")
        .controller("ApiErrorPopupController", ApiErrorPopupController)
        .service("apiErrorPopupService", ApiErrorPopupService)
        .directive("iscApiErrorPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Core-ApiErrorPopup",
            scope: {},
            controller: "ApiErrorPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}