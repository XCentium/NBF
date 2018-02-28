module nbf.SiteMessages {
    "use strict";

    export interface ICommentMessageControllerAttributes extends ng.IAttributes {
        commentSubject: string;
    }

    export class CommentMessagesController {
        name: string;
        email: string;
        message: string;
        subject: string;
        submitted = false;
        $form: JQuery;
        static $inject = ["$element", "$scope", "$attrs", "commentMessageService", "$window", "spinnerService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected $attrs: ICommentMessageControllerAttributes,
            protected commentMessageService: ICommentMessageService,
            protected $window: ng.IWindowService,
            protected spinnerService: insite.core.SpinnerService) {
            this.init();
        }

        init(): void {
            this.subject = this.$attrs.commentSubject;

            this.$form = this.$element.find("form");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);

        }

        submit(): boolean {
            if (!this.$form.valid()) {
                return false;
            }

            this.submitComment();

            return false;
        }

        submitComment(): void {
            this.spinnerService.show("mainLayout", true);
            var params = {};
        
            params["subject"] = this.subject;
            if (!params["subject"] || params["subject"].length == 0) {
                params["subject"] = "blank subject";
            }
            var message = "Page: <br />" + window.location.href + "<br />";
            message += "Name: " + this.name + "<br />";
            message += "Email: " + this.email + "<br />";
            message += "Message: <br />";
            message += this.message;

            params["message"] = message;
            params["targetRole"] = "Administrator";

            this.commentMessageService.addComment(params).then(result => {
                this.spinnerService.hide("mainLayout");
                this.submitted = true;
                
            });
        }
    }

    angular
        .module("insite")
        .controller("CommentMessagesController", CommentMessagesController);
}