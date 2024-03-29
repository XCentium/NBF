﻿module insite.contactus {
    "use strict";

    export class NbfContactUsController extends ContactUsController {
        
        static $inject = ["$element", "$scope", "$rootScope", "$window"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected $window: ng.IWindowService
        ) {
            super($element, $scope);
            var self = this;
            setTimeout(function () {
                self.$rootScope.$broadcast("AnalyticsEvent", "ContactUsInitiated");
            }, 1500);
            
        }

        init(): void {
            super.init();
            
        }

        submit($event: ng.IAngularEvent): boolean {
            const valid = angular.element("#contactUsForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);
                return;
            }

            (this.$form as any).ajaxPost(() => {
                this.submitted = true;
                this.$scope.$apply();

                this.$window.location.href = "/Contact-Us/Confirmation-Page";

            });
            this.$rootScope.$broadcast("AnalyticsEvent", "ContactUsCompleted");
            $event.preventDefault();
            return false;
        }
    }

    angular
        .module("insite")
        .controller("ContactUsController", NbfContactUsController);
}