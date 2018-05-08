module insite.catalog {
    "use strict";

    export class TellAFriendController {
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
            this.resetPopup();
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
        }

        shareWithFriend(): void {
            const valid = angular.element("#tellAFriendForm").validate().form();
            if (!valid) {
                return;
            }

            this.tellAFriendModel = this.tellAFriendModel || {} as TellAFriendModel;
            this.tellAFriendModel.productId = this.product.id.toString();
            this.tellAFriendModel.productImage = this.product.mediumImagePath;
            this.tellAFriendModel.productShortDescription = this.product.shortDescription;
            this.tellAFriendModel.altText = this.product.altText;
            this.tellAFriendModel.productUrl = this.product.productDetailUrl;

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
        }
    }

    angular
        .module("insite")
        .controller("TellAFriendController", TellAFriendController);
}