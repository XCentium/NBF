interface Window {
    javaScriptErrors: string[];
    recordError(errorMessage: string): void;
    dataLayer: any;
    currentVersion: string;
    safariBackState: any;
}

module insite {
    "use strict";

    export class NBFAppRunService extends AppRunService {
        static $inject = ["coreService", "$localStorage", "$window", "$rootScope", "$urlRouter", "spinnerService", "$location"];

        constructor(
            protected coreService: core.ICoreService,
            protected $localStorage: common.IWindowStorage,
            protected $window: ng.IWindowService,
            protected $rootScope: IAppRootScope,
            protected $urlRouter: angular.ui.IUrlRouterService,
            protected spinnerService: core.ISpinnerService,
            protected $location: ng.ILocationService) {
            super(coreService, $localStorage, $window, $rootScope, $urlRouter, spinnerService, $location);
        }

        run(): void {
            super.run();
            //satellite.pageBottom();
        }

        protected onLocationChangeSuccess(): void {
            if (this.$rootScope.firstPage) {
                this.$urlRouter.listen();
                // fixes popups on initial page
                this.coreService.refreshUiBindings();
            }
        }

        protected onLocationChangeStart(): void {
            // on the first link click, hide the first page that was rendered server side
            this.$rootScope.firstPage = false;
            this.spinnerService.show("mainLayout");
        }

        protected onStateChangeSuccess(): void {
            this.spinnerService.hide("mainLayout");
        }

        protected onViewContentLoaded(): void {
            ($(document) as any).foundation();
            if (!this.$rootScope.firstPage) {
                this.sendGoogleAnalytics();
            }
            this.sendVirtualPageView();
        }

        sendGoogleAnalytics(): void {
            if (typeof ga !== "undefined") {
                ga("set", "location", this.$location.absUrl());
                ga("set", "page", this.$location.url());
                ga("send", "pageview");
            }
        }

        sendVirtualPageView(): void {
            if (window.dataLayer && (window as any).google_tag_manager) {
                window.dataLayer.push({
                    event: "virtualPageView",
                    page: {
                        title: window.document.title,
                        url: this.$location.url()
                    }
                });
            }
        }

        protected queryString(a: string[]): { [key: string]: string; } {
            if (!a) {
                return {};
            }
            const b: { [key: string]: string; } = {};
            for (let i = 0; i < a.length; ++i) {
                const p = a[i].split("=");
                if (p.length !== 2) {
                    continue;
                }
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        }
    }
    
}