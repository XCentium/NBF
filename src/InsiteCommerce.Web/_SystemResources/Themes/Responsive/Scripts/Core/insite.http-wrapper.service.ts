module insite.core {
    "use strict";

    export class HttpWrapperService {
        static $inject = ["$http", "$q"];

        constructor(protected $http: ng.IHttpService, protected $q: ng.IQService) {
        }

        executeHttpRequest<T>(caller: any, requestMethod: ng.IHttpPromise<T>, completedFunction: Function, failedFunction: Function): ng.IPromise<T> {
            const deferred = this.$q.defer();
            requestMethod
                .then(
                    (response: ng.IHttpPromiseCallbackArg<T>) => {
                    if (completedFunction) {
                        completedFunction.call(caller, response);
                    }

                    deferred.resolve(response.data);
                    },
                    (error: ng.IHttpPromiseCallbackArg<any>) => {
                    if (failedFunction) {
                        failedFunction.call(caller, error);
                    }

                    deferred.reject(error.data);
                    });
            return deferred.promise;
        }
    }

    angular
        .module("insite")
        .service("httpWrapperService", HttpWrapperService);
}