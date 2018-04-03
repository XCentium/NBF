module insite.cart {
    "use strict";

    export class TermsAndConditionsPopupController {
        terms: string;

        static $inject = [
            "$scope",
            "coreService",
            "settingsService",
            "termsAndConditionsPopupService"
        ];

        constructor(
            protected $scope: ICartScope,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected termsAndConditionsPopupService: ITermsAndConditionsPopupService) {

            this.init();
        }

        init(): void {
            this.registerDisplayFunction();
        }

        protected registerDisplayFunction(): void {
            this.termsAndConditionsPopupService.registerDisplayFunction((data: any) => this.displayFunction(data));
        }

        protected displayFunction(data: ITermsAndConditionsPopupServiceDisplayData): void {
            let showPopup: boolean;

            if (data && typeof data.showTermsAndConditionsPopup !== "undefined" && data.showTermsAndConditionsPopup !== null) {
                showPopup = data.showTermsAndConditionsPopup;
            }

            if (!showPopup) {
                return;
            }

            const popupSelector = ".terms-and-conditions-popup";
            const $popup = angular.element(popupSelector);
            if ($popup.length <= 0) {
                return;
            }

            this.coreService.displayModal($popup);
        }
    }

    export interface ITermsAndConditionsPopupServiceDisplayData {
        showTermsAndConditionsPopup?: boolean;
    }

    export interface ITermsAndConditionsPopupService {
        display(data: ITermsAndConditionsPopupServiceDisplayData): void;
        registerDisplayFunction(p: (data: ITermsAndConditionsPopupServiceDisplayData) => void);
    }

    export class TermsAndConditionsPopupService extends base.BasePopupService<ITermsAndConditionsPopupServiceDisplayData> implements ITermsAndConditionsPopupService {
        protected getDirectiveHtml(): string {
            return "<nbf-terms-and-conditions-popup></nbf-terms-and-conditions-popup>";
        }
    }

    angular
        .module("insite")
        .controller("TermsAndConditionsPopupController", TermsAndConditionsPopupController)
        .service("addToCartPopupService", AddToCartPopupService)
        .directive("nbfTermsAndConditionsPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Custom-Cart-NbfTermsAndConditionsPopup",
            controller: "TermsAndConditionsPopupController",
            controllerAs: "vm",
            scope: {
                terms: "="
            },
            bindToController: true
        }));
}