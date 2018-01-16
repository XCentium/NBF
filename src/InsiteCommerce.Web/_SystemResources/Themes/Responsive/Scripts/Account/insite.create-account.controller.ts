module insite.account {
    "use strict";

    export class CreateAccountController {
        createError: string;
        email: string;
        isSubscribed: boolean;
        password: string;
        returnUrl: string;
        settings: AccountSettingsModel;
        userName: string;

        static $inject = [
            "accountService",
            "sessionService",
            "coreService",
            "settingsService",
            "queryString",
            "accessToken"
        ];

        constructor(
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected queryString: common.IQueryStringService,
            protected accessToken: common.IAccessTokenService) {
            this.init();
        }

        init(): void {
            this.returnUrl = this.queryString.get("returnUrl");

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.accountSettings;
        }

        protected getSettingsFailed(error: any): void {
        }

        createAccount(): void {
            this.createError = "";

            const valid = $("#createAccountForm").validate().form();
            if (!valid) {
                return;
            }

            const account = {
                email: this.email,
                userName: this.userName,
                password: this.password,
                isSubscribed: this.isSubscribed
            } as AccountModel;

            this.accountService.createAccount(account).then(
                (createdAccount: AccountModel) => { this.createAccountCompleted(createdAccount); },
                (error: any) => { this.createAccountFailed(error); });
        }

        protected createAccountCompleted(account: AccountModel): void {
            this.accessToken.generate(this.userName, this.password).then(
                (accessToken: common.IAccessTokenDto) => { this.generateAccessTokenCompleted(account, accessToken); },
                (error: any) => { this.generateAccessTokenFailed(error); });
        }

        protected createAccountFailed(error: any): void {
            this.createError = error.message;
        }

        protected generateAccessTokenCompleted(account: AccountModel, accessToken: common.IAccessTokenDto): void {
            this.accessToken.set(accessToken.accessToken);
            const currentContext = this.sessionService.getContext();
            currentContext.billToId = account.billToId;
            currentContext.shipToId = account.shipToId;
            
            this.sessionService.setContext(currentContext);
            this.coreService.redirectToPathAndRefreshPage(this.returnUrl);
        }

        protected generateAccessTokenFailed(error: any): void {
            this.createError = error.message;
        }
    }

    angular
        .module("insite")
        .controller("CreateAccountController", CreateAccountController);
}