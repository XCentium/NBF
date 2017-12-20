module insite.cart {
    "use strict";

    export class AddressErrorPopupController {
        isAddressEditAllowed: boolean;
        checkoutAddressUrl: string;
        myAccountAddressUrl: string;
        reviewAndPayPageUrl: string;
        continueUrl: string;

        static $inject = ["$scope", "coreService", "settingsService", "addressErrorPopupService", "$window"];

        constructor(
            protected $scope: ICartScope,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected addressErrorPopupService: IAddressErrorPopupService,
            protected $window: ng.IWindowService) {
            this.init();
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.isAddressEditAllowed = settingsCollection.customerSettings.allowBillToAddressEdit && settingsCollection.customerSettings.allowShipToAddressEdit;
            this.registerDisplayFunction();
        }

        protected getSettingsFailed(error: any): void {
        }

        protected registerDisplayFunction(): void {
            this.addressErrorPopupService.registerDisplayFunction(() => this.displayFunction());
        }

        protected displayFunction(): void {
            const $popup = angular.element(".address-error-popup");
            if ($popup.length > 0) {
                const path = this.$window.location.pathname.toLowerCase();
                if (path.indexOf(this.checkoutAddressUrl.toLowerCase()) > -1 || path.indexOf(this.myAccountAddressUrl.toLowerCase()) > -1) {
                    this.continueUrl = "";
                } else {
                    this.continueUrl = path.indexOf(this.reviewAndPayPageUrl.toLowerCase()) > -1 ? this.checkoutAddressUrl : this.myAccountAddressUrl;
                }
                this.coreService.displayModal($popup);
            }
        }
    }

    export interface IAddressErrorPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class AddressErrorPopupService extends base.BasePopupService<any> implements IAddressErrorPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-address-error-popup></isc-address-error-popup>";
        }
    }

    angular
        .module("insite")
        .controller("AddressErrorPopupController", AddressErrorPopupController)
        .service("addressErrorPopupService", AddressErrorPopupService)
        .directive("iscAddressErrorPopup", () => ({
                restrict: "E",
                replace: true,
                templateUrl: "/PartialViews/Cart-AddressErrorPopup",
                scope: {},
                controller: "AddressErrorPopupController",
                controllerAs: "vm",
                bindToController: true
            }));
}