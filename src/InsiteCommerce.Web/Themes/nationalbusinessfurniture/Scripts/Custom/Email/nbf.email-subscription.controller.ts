module insite.email {
    "use strict";
    
    export class NBFEmailSubscriptionController {
        submitted = false;
        $form: JQuery;
        email: string = '';

        static $inject = ["$element", "$scope", "listrakService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected listrakService: nbf.listrak.IListrakService) {
            this.init();
        }

        init(): void {
            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);
        }

        submit($event): boolean {
            $event.preventDefault();
            if (!this.$form.valid()) {
                return false;
            }
            this.listrakService.CreateContact(this.email, "footer").success(() => {
                this.submitted = true;
                return true;
            });
            
            return false;
        }
    }

    angular
        .module("insite")
        .controller("NBFEmailSubscriptionController", NBFEmailSubscriptionController);
}