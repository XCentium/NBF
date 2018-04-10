module insite.contactus {
    "use strict";

    export class ContactUsController {
        submitted = false;
        $form: JQuery;

        static $inject = ["$element", "$scope"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope) {
            this.init();
        }

        init(): void {
            //this.$form = this.$element.find("form");
            //this.$form.removeData("validator");
            //this.$form.removeData("unobtrusiveValidation");
            //$.validator.unobtrusive.parse(this.$form);
        }

        submit($event): boolean {
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
            });

            return false;
        }
    }

    angular
        .module("insite")
        .controller("ContactUsController", ContactUsController);
}