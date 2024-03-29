﻿module nbf.ContactUsSpanish {
    "use strict";

    export class NbfContactUsSpanishController {      
        contactUsForm: any = {};
        submitted: boolean = false;
        $form: JQuery;
        static $inject = ["$element", "$scope", "nbfEmailService", "$rootScope"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected nbfEmailService: email.INbfEmailService,
            protected $rootScope: ng.IRootScopeService
        ) {
            this.init();
        }

        init(): void {
            this.$rootScope.$broadcast("AnalyticsEvent", "ContactUsInitiated");
        }

        sendEmail($event): boolean
        {
            const valid = angular.element("#contactUsSpanishForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);
                return;
            }
            
            this.nbfEmailService.sendContactUsSpanishForm(this.contactUsForm).then(
                (contactUsSpanish: string) => {
                    this.getContactUsSpanishCompleted(contactUsSpanish);
                    this.submitted = true;
                },
                (error: any) => { this.getContactUsSpanishFailed(error); });

            return false;
        }

        protected getContactUsSpanishCompleted(contactUsSpanish: string): void {
            //if (this.contactUsFormForm) {
            //    this.contactUsFormForm.$setPristine();
            //} 
            this.$rootScope.$broadcast("AnalyticsEvent", "ContactUsCompleted");
        }

        protected getContactUsSpanishFailed(error?: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfContactUsSpanishController", NbfContactUsSpanishController);
}