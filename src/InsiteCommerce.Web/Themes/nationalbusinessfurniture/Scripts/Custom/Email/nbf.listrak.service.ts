
module nbf.listrak {
    "use strict";

    export interface IListrakService {

        CreateContact(emailAddress: string, eventType: string): ng.IHttpPromise<boolean>;
    }

    export class ListrakService implements IListrakService {

        currentLocationId: string;
        serviceUri = "/api/nbf/listrak";

        constructor(protected $rootScope: ng.IRootScopeService,
            protected $http: ng.IHttpService,
            protected $q: ng.IQService,
            protected coreService: insite.core.ICoreService) {
        }

        CreateContact(emailAddress: string, eventType: string): ng.IHttpPromise<boolean> {
            var uri = this.serviceUri;
            //var query = "?" + this.coreService.parseParameters(parameters);
            uri += "/createcontact";
            var config = {
                headers: { 'Content-Type': "application/json" }
            };
            var model = {};

            model["emailAddress"] = emailAddress;
            model["eventId"] = eventType;
            model["subscribedByContact"] = true;
            model["overrideUnsubscribe"] = true;
            
            return this.$http.post(uri, model, config);
        }
    }

    function factory($rootScope: ng.IRootScopeService, $http: ng.IHttpService, $q: ng.IQService, coreService: insite.core.ICoreService): ListrakService {
        return new ListrakService($rootScope, $http, $q, coreService);
    }
    factory.$inject = ["$rootScope", "$http", "$q", "coreService"];

    angular
        .module("insite")
        .factory("listrakService", factory);
}

