module nbf.guest {
    "use strict";

    export interface INbfGuestActivationService {
        createAccountFromGuest(guestId: string, account: AccountModel, billTo: BillToModel, shipTo: ShipToModel): ng.IPromise<AccountModel>;
        checkUserName(userName: string): ng.IPromise<boolean>;
    }

    export class NbfGuestActivationService implements INbfGuestActivationService {
        serviceUri = "/api/nbf/guestActivation";
        billTo: BillToModel;
        shipTo: ShipToModel;

        userName: string;
        tempPass: string;
        newPass: string;

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService) {
        }

        createAccountFromGuest(guestId: string, account: AccountModel, billTo: BillToModel, shipTo: ShipToModel): ng.IPromise<AccountModel> {
            this.billTo = billTo;
            this.shipTo = shipTo;
            this.newPass = account.password;

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http.post(this.serviceUri, this.guestAccountParams(account, guestId)),
                this.createAccountCompleted,
                this.createAccountFailed
            );
        }

        checkUserName(userName: string) : ng.IPromise <boolean> {
            const uri = `${this.serviceUri}?userName=${userName}`;
                return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "GET" }),
                this.checkUserNameCompleted,
                this.checkUserNameFailed);
        }

        protected checkUserNameCompleted(response: ng.IHttpPromiseCallbackArg<boolean>) {

        }

        protected checkUserNameFailed(error: any) {

        }

        protected guestAccountParams(account: AccountModel, guestId: string): any {
            return { "account": account, "guestId": guestId };
        }

        protected createAccountCompleted(response: ng.IHttpPromiseCallbackArg<AccountModel>): void {

        }

        protected createAccountFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            //Something went wrong
        }

    }

    angular
        .module("insite")
        .service("nbfGuestActivationService", NbfGuestActivationService);
}