module insite.account {
	"use strict";

	export class NbfSignInController extends account.SignInController {
		isGuest: boolean;
		
		signIn(errorMessage: string): void {
			this.signInError = "";

			if (this.signInForm.$invalid) {
				return;
			}

			this.disableSignIn = true;
			this.spinnerService.show("mainLayout", true);
			if (this.isGuest) {
				this.sessionService.signOut();
			}
			this.accessToken.remove();
			this.accessToken.generate(this.userName, this.password).then(
				(accessTokenDto: common.IAccessTokenDto) => { this.generateAccessTokenOnSignInCompleted(accessTokenDto); },
				(error: any) => { this.generateAccessTokenOnSignInFailed(error); });
		}
	}

	angular
		.module("insite")
		.controller("SignInController", NbfSignInController);
}