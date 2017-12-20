﻿module insite.core {
    "use strict";

    interface ISettingsCollectionWrapper {
        settingsCollection: SettingsCollection;
    }

    export class SettingsCollection {
        accountSettings: AccountSettingsModel;
        cartSettings: CartSettingsModel;
        customerSettings: any;
        invoiceSettings: Insite.Invoice.WebApi.V1.ApiModels.InvoiceSettingsModel;
        orderSettings: Insite.Order.WebApi.V1.ApiModels.OrderSettingsModel;
        productSettings: ProductSettingsModel;
        quoteSettings: QuoteSettingsModel;
        searchSettings: any;
        wishListSettings: WishListSettingsModel;
    }

    export interface ISettingsService {
        getSettings(): ng.IPromise<SettingsCollection>;
    }

    export class SettingsService implements ISettingsService {
        settingsUri = "/api/v1/settings";
        settingsCollections = {} as any;
        deferredRequests = {} as any;

        static $inject = ["$http", "accessToken", "$q", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected accessToken: common.IAccessTokenService,
            protected $q: ng.IQService,
            protected httpWrapperService: core.HttpWrapperService) {
        }

        getSettings(): ng.IPromise<SettingsCollection> {
            const deferred = this.$q.defer();

            const isAuthenticated = this.accessToken.exists().toString();

            // using this to reference a property on an object makes it easy to remove duplication, but the code is harder to understand.
            if (typeof (this.settingsCollections[isAuthenticated]) !== "undefined") {
                deferred.resolve(this.settingsCollections[isAuthenticated]);
            } else {
                if (typeof (this.deferredRequests[isAuthenticated]) !== "undefined") {
                    this.deferredRequests[isAuthenticated].push(deferred);
                } else {
                    this.deferredRequests[isAuthenticated] = [];
                    this.httpWrapperService.executeHttpRequest(
                        this,
                        this.$http.get(`${this.settingsUri}?auth=${isAuthenticated}`),
                        (response: ng.IHttpPromiseCallbackArg<ISettingsCollectionWrapper>) => { this.getSettingsCompleted(response, isAuthenticated, deferred); },
                        this.getSettingsFailed
                    );
                }
            }

            return deferred.promise;
        }

        protected getSettingsCompleted(response: ng.IHttpPromiseCallbackArg<ISettingsCollectionWrapper>, isAuthenticated: string, deferred: ng.IDeferred<SettingsCollection>): void {
            this.settingsCollections[isAuthenticated] = response.data.settingsCollection;
            deferred.resolve(this.settingsCollections[isAuthenticated]);
            for (let i = 0; i < this.deferredRequests[isAuthenticated].length; i++) {
                this.deferredRequests[isAuthenticated][i].resolve(this.settingsCollections[isAuthenticated]);
            }
        }

        protected getSettingsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }
    }

    angular
        .module("insite")
        .service("settingsService", SettingsService);
}