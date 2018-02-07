module nbf.Checkout {
    "use strict";

    export interface INbfCheckoutService {
        createAccountFromGuest(guestId: string, account: AccountModel, billTo: BillToModel, shipTo: ShipToModel, newPass: string): ng.IPromise<AccountModel>;
        checkUserName(userName: string): ng.IPromise<boolean>;
    }

    export class NbfCheckoutService implements INbfCheckoutService {
        serviceUri = "/api/nbf/guestCheckout";
        billTo: BillToModel;
        shipTo: ShipToModel;
        newPass: string;

        static $inject = ["$http", "$window", "httpWrapperService", "accountService", "customerService", "$location", "$localStorage", "coreService", "sessionService", "accessToken"];

        constructor(
            protected $http: ng.IHttpService,
            protected $window: ng.IWindowService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected accountService: insite.account.IAccountService,
            protected customerService: insite.customers.ICustomerService,
            protected $location: ng.ILocaleService,
            protected $localStorage: insite.common.IWindowStorage,
            protected coreService: insite.core.ICoreService,
            protected sessionService: insite.account.ISessionService,
            protected accessToken: insite.common.IAccessTokenService,
            protected $rootScope: ng.IRootScopeService) {
        }

        createAccountFromGuest(guestId: string, account: AccountModel, billTo: BillToModel, shipTo: ShipToModel, newPass: string): ng.IPromise<AccountModel> {
            this.billTo = billTo;
            this.shipTo = shipTo;
            this.newPass = newPass;

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
            if (response != null) {
                this.billTo.isGuest = false;
                this.customerService.updateBillTo(this.billTo).then(
                    (billTo: BillToModel) => { this.updateBillToCompleted(billTo); },
                    (error: any) => { this.updateBillToFailed(error); });

                const session: SessionModel = {
                    password: this.$localStorage.get("guestId"),
                    newPassword: this.newPass,
                    userName: response.data.userName,
                    userLabel: response.data.userName,
                    email: response.data.email,
                    activateAccount: true
                } as any;

                this.sessionService.changePassword(session).then(
                    (updatedSession: SessionModel) => { this.changePasswordCompleted(updatedSession); },
                    (error: any) => { this.changePasswordFailed(error); });
            }
        }

        protected changePasswordCompleted(session: SessionModel): void {
            this.$localStorage.set("changePasswordDate", (new Date()).toLocaleString());
            this.$rootScope.$broadcast("sessionReloaded", session);
            console.dir(session);
            debugger;
        }

        protected changePasswordFailed(error: any): void {
            //Something went wrong
        }

        protected createAccountFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            //Something went wrong
        }

        protected updateBillToCompleted(billTo: BillToModel): void {
            if (this.shipTo.id !== this.billTo.id) {
                const shipTo = this.shipTo;
                if ((shipTo as any).shipTos) {
                    /* In the situation the user selects the billTo as the shipTo we need to remove the shipTos collection
                       from the object to prevent a circular reference when serializing the object. See the unshift command below. */
                    angular.copy(this.shipTo, shipTo);
                    delete (shipTo as any).shipTos;
                }

                this.customerService.addOrUpdateShipTo(shipTo).then(
                    (result: ShipToModel) => { this.addOrUpdateShipToCompleted(result); },
                    (error: any) => { this.addOrUpdateShipToFailed(error); });
            } else {
                (angular.element("#saveSuccess") as any).foundation("reveal", "open");
            }
        }

        protected updateBillToFailed(error: any): void {
            //Something went wrong
        }

        protected addOrUpdateShipToCompleted(result: any): void {
            this.$localStorage.set("createdShipToId", result.id);
            (<any>this.$location).search("isNewShipTo", null);
        }

        protected addOrUpdateShipToFailed(error: any): void {
            //Something went wrong
        }
    }

    angular
        .module("insite")
        .service("nbfCheckoutService", NbfCheckoutService);
}