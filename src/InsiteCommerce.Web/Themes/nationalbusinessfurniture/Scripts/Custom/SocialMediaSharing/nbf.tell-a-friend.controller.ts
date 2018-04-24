module insite.catalog {
    "use strict";

    export class NbfTellAFriendController {
        tellAFriendModel: TellAFriendModel;
        isSuccess: boolean;
        isError: boolean;

        static $inject = ["$scope", "emailService"];

        constructor(
            protected $scope: ng.IScope,
            protected emailService: email.IEmailService) {
            this.init();
        }

        init(): void {
            angular.element("#TellAFriendDialogContainer").on("closed", () => {
                this.onTellAFriendPopupClosed();
            });
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
        }

        shareWithFriend(): void {
            const valid = angular.element("#tellAFriendForm").validate().form();
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
    }

    angular
        .module("insite")
        .controller("NbfTellAFriendController", NbfTellAFriendController);
}