module insite.catalog {
    "use strict";

    export class NbfTellAFriendController {
       // myForm: any;
        tellAFriendModel: TellAFriendModel;
        product: ProductDto;
        isSuccess: boolean = false;
        isError: boolean = false;
        url: string;

        static $inject = ["$scope", "emailService", "coreService", "$anchorScroll"];

        constructor(
            protected $scope: ng.IScope,
            protected emailService: email.IEmailService,
            protected coreService: insite.core.ICoreService,
            protected $anchorScroll: ng.IAnchorScrollService) {
            this.init();
        }

        init(): void {
            angular.element("#TellAFriendDialogContainer").on("closed", () => {
                this.onTellAFriendPopupClosed();
            });

            this.url = window.location.href;
        }

        protected onTellAFriendPopupClosed(): void {
            this.resetPopup();
            this.$scope.$apply();
        }

        protected resetPopup(): void {
            this.tellAFriendModel = this.tellAFriendModel || {} as TellAFriendModel;
            this.tellAFriendModel.friendsName = "";
            this.tellAFriendModel.friendsEmailAddress = "";
            this.tellAFriendModel.yourName = "";
            this.tellAFriendModel.yourEmailAddress = "";
            this.tellAFriendModel.yourMessage = "";
            this.isSuccess = false;
            this.isError = false;

            var form = angular.element("#tellAFriendForm");
            form.validate().resetForm();
            (form[0] as any).reset();
        }

        shareWithFriend(): void {
            const validator = angular.element("#tellAFriendForm").validate();
            const valid = validator.form();
            if (!valid) {
                return;
            }

            this.tellAFriendModel.productUrl = window.location.href;

            this.emailService.tellAFriend(this.tellAFriendModel).then(
                (tellAFriendModel: TellAFriendModel) => { this.tellAFriendCompleted(tellAFriendModel); },
                (error: any) => { this.tellAFriendFailed(error); });
        }

        protected tellAFriendCompleted(tellAFriendModel: TellAFriendModel): void {
            this.isSuccess = true;
            this.isError = false;
        }

        protected tellAFriendFailed(error: any): void {
            this.isSuccess = false;
            this.isError = true;
        }

        protected openShareWithFriendPopup(): void {
            this.coreService.displayModal(angular.element("#TellAFriendDialogContainer"));
            this.$anchorScroll();
            this.resetPopup();
        }
    }

    angular
        .module("insite")
        .controller("NbfTellAFriendController", NbfTellAFriendController);
}