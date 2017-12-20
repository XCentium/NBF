module insite.account {
    "use strict";

    export class AccountSettingsController {
        settings: AccountSettingsModel;
        account: AccountModel;
        isAccountPasswordChanged = false;
        changeSubscriptionError = "";
        manageSubscriptionsForm: any;
        savedAccountEmail: string;

        static $inject = ["accountService", "$localStorage", "settingsService"];

        constructor(
            protected accountService: account.IAccountService,
            protected $localStorage: common.IWindowStorage,
            protected settingsService: core.ISettingsService) {
            this.init();
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.accountService.getAccount().then(
                (account: AccountModel) => { this.getAccountCompleted(account); },
                (error: any) => { this.getAccountFailed(error); });

            this.checkIfAccountPasswordChanged();
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.accountSettings;
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getAccountCompleted(account: AccountModel): void {
            this.account = account;
            this.savedAccountEmail = account.email;
        }

        protected getAccountFailed(error: any): void {
        }

        checkIfAccountPasswordChanged(): void {
            const dateValue = this.$localStorage.get("changePasswordDate");
            if (dateValue) {
                const diff = Math.abs(((new Date(dateValue)) as any) - ((new Date()) as any));
                const minutes = Math.floor((diff / 1000) / 60);
                if (minutes <= 10) {
                    this.isAccountPasswordChanged = true;
                    setTimeout(() => {
                        this.isAccountPasswordChanged = false;
                    }, 10000);
                }

                this.$localStorage.remove("changePasswordDate");
            }
        }

        changeSubscription(): void {
            if (!this.manageSubscriptionsForm.$valid) {
                return;
            }

            this.changeSubscriptionError = "";

            this.accountService.updateAccount(this.account).then(
                (account: AccountModel) => { this.updateAccountCompleted(account); },
                (error: any) => { this.updateAccountFailed(error); });
        }

        protected updateAccountCompleted(account: AccountModel): void {
            (angular.element("#manageSubscriptionSuccess") as any).foundation("reveal", "open");
            this.savedAccountEmail = account.email;
        }

        protected updateAccountFailed(error: any): void {
            this.changeSubscriptionError = error.message;
        }
    }

    angular
        .module("insite")
        .controller("AccountSettingsController", AccountSettingsController);
}