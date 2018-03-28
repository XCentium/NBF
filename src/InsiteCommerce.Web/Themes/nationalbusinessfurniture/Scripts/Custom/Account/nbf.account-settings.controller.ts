module insite.account {
    "use strict";
    export interface ContractOption {
        displayName: string;
        value: string;
    }

    export class NbfAccountSettingsController extends AccountSettingsController {
        session: SessionModel;
        contractOptions: ContractOption[];
        priceCode: ContractOption;

        static $inject = ["accountService", "$localStorage", "settingsService", "coreService", "sessionService", "customerService", "nbfPriceCodeService"];

        constructor(
            protected accountService: account.IAccountService,
            protected $localStorage: common.IWindowStorage,
            protected settingsService: core.ISettingsService,
            protected coreService: core.ICoreService,
            protected sessionService: account.ISessionService,
            protected customerService: customers.ICustomerService,
            protected nbfPriceCodeService: nbf.PriceCode.INbfPriceCodeService) {
            super(accountService, $localStorage, settingsService, coreService, sessionService);
        }

        init(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.accountService.getAccount().then(
                (account: AccountModel) => { this.getAccountCompleted(account); },
                (error: any) => { this.getAccountFailed(error); });

            this.checkIfAccountPasswordChanged();

            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });

            this.contractOptions = [];
            this.contractOptions.push({
                displayName: "None",
                value: "None"
            } as ContractOption);
            this.contractOptions.push({
                displayName: "GSA",
                value: "GSA"
            } as ContractOption);
            this.contractOptions.push({
                displayName: "Vizient",
                value: "Vizient"
            } as ContractOption);
            this.contractOptions.push({
                displayName: "TXMAS",
                value: "TXMAS"
            } as ContractOption);
            this.contractOptions.push({
                displayName: "CMAS",
                value: "CMAS"
            } as ContractOption);
            this.contractOptions.push({
                displayName: "Navy BPA",
                value: "Navy BPA"
            } as ContractOption);
            this.contractOptions.push({
                displayName: "Premier",
                value: "Premier"
            } as ContractOption);
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;

            this.nbfPriceCodeService.getPriceCode(this.session.billTo.id).then(
                (priceCode: string) => {
                    this.priceCode = this.contractOptions.filter(o => o.value.toLowerCase() === priceCode.toLowerCase())[0];
                    if (!this.priceCode) {
                        this.priceCode = this.contractOptions[0];
                    }
                });
        }

        protected getSessionFailed(error: any): void {
        }

        updatePriceCode(): void {
            this.nbfPriceCodeService.setPriceCode(this.priceCode.value, this.session.billTo.id).then(
                () => { }
            );
        }

        protected updateSession(): void {
            this.sessionService.updateSession({} as SessionModel).then(
                (session: SessionModel) => { this.updateSessionCompleted(session); },
                (error: any) => { this.updateSessionFailed(error); });
        }

        protected updateSessionCompleted(session: SessionModel): void {   
        }

        protected updateSessionFailed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfAccountSettingsController", NbfAccountSettingsController);
}