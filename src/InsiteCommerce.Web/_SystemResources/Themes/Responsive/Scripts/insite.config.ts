module insite {
    "use strict";

    export interface IContentPageStateParams extends angular.ui.IStateParamsService {
        path: string;
    }

    export interface ISearchMicrositeStateParams extends angular.ui.IStateParamsService {
        microsite: string;
    }

    export class Config {
        static $inject = ["$httpProvider", "$sceDelegateProvider", "$compileProvider", "$stateProvider", "$urlRouterProvider", "$locationProvider", "$provide"];

        constructor(
            protected $httpProvider: ng.IHttpProvider,
            protected $sceDelegateProvider: ng.ISCEDelegateProvider,
            protected $compileProvider: ng.ICompileProvider,
            protected $stateProvider: angular.ui.IStateProvider,
            protected $urlRouterProvider: angular.ui.IUrlRouterProvider,
            protected $locationProvider: ng.ILocationProvider,
            protected $provide: ng.auto.IProvideService) {
            const baseUri = $("body").attr("data-webApiRoot");
            if (typeof (baseUri) !== "undefined" && baseUri !== "") {
                $sceDelegateProvider.resourceUrlWhitelist(["self", `${baseUri}/**`]);
                $httpProvider.defaults.withCredentials = true;
            }

            $httpProvider.interceptors.push("authenticationInterceptor");
            $httpProvider.interceptors.push("httpErrorsInterceptor");

            $compileProvider.debugInfoEnabled(false);

            // turn off router on first page view because we render it server side. AppRunService will turn it back on.
            $urlRouterProvider.deferIntercept();

            // all pages are the same state and make requests for the partials on the server
            $stateProvider
                .state("search", {
                    url: "/search?criteria&includeSuggestions",
                    templateUrl: () => "/search"
                })
                .state("search_microsite", {
                    url: "/:microsite/search?criteria&includeSuggestions",
                    templateUrl: (stateParams: ISearchMicrositeStateParams) => `/${stateParams.microsite}/search`
                })
                .state("content", {
                    url: "*path",
                    templateUrl: (stateParams: IContentPageStateParams) => stateParams.path
                });

            $locationProvider.html5Mode(true);

            $provide.decorator("$exceptionHandler", ["$delegate", ($delegate: ng.IExceptionHandlerService) => (exception: Error, cause: string) => {
                if (typeof (window.recordError) === "function") {
                    window.recordError(exception.message);
                }
                $delegate(exception, cause);
            }]);
        }
    }

    angular
        .module("insite")
        .config(["$httpProvider", "$sceDelegateProvider", "$compileProvider", "$stateProvider", "$urlRouterProvider", "$locationProvider", "$provide",
            ($httpProvider: ng.IHttpProvider, $sceDelegateProvider: ng.ISCEDelegateProvider, $compileProvider: ng.ICompileProvider, $stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider, $locationProvider: ng.ILocationProvider, $provide: ng.auto.IProvideService) =>
                new Config($httpProvider, $sceDelegateProvider, $compileProvider, $stateProvider, $urlRouterProvider, $locationProvider, $provide)]);
}