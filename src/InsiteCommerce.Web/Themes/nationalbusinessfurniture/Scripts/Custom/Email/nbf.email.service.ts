﻿module nbf.email {
    "use strict";

    export interface INbfEmailService {
        sendCatalogPrefsEmail(params: any): ng.IPromise<string>;
        sendTaxExemptEmail(params: any, file: any): ng.IPromise<string>;
    }

    export class NbfEmailService implements INbfEmailService {
        serviceUri = "api/nbf/email";        

        static $inject = ["$http", "httpWrapperService", "queryString", "$sessionStorage", "ipCookie", "$q"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService,
            protected queryString: insite.common.IQueryStringService,
            protected $sessionStorage: insite.common.IWindowStorage,
            protected ipCookie: any,
            protected $q: ng.IQService) {
        }

        sendCatalogPrefsEmail(params: any): ng.IPromise<string> {
            const uri = this.serviceUri + "/catalogPrefs";

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "POST", data: params}),
                this.sendEmailCompleted,
                this.sendEmailFailed
            );
        }

        sendTaxExemptEmail(params: any, file: any): ng.IPromise<string> {
            const uri = this.serviceUri + "/taxexempt";
            const fileUri = this.serviceUri + "/taxexemptfile";

            var result = "false";
            //upload File

            const formData = new FormData();
            formData.append("file", file);

            const config = {
                headers: { "Content-Type": undefined }
            };

            this.$http.post(fileUri, formData, config).success((data: any) => {
                if (data.errorMessage && data.errorMessage.length > 0) {
                    alert("error");
                } else {
                    this.postFileUploadData(params).then((uploadData) => {
                        result = uploadData;
                    });
                }
            });

            const defer = this.$q.defer<string>();
            defer.resolve(result);
            return defer.promise;
        } 

        protected sendEmailCompleted(catalogMailingPrefs: string): void {
            
        }

        protected sendEmailFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            
        }

        protected postFileUploadData(params: any) : ng.IPromise<string> {
            const uri = this.serviceUri + "/catalogPrefs";

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "POST", data: params }),
                this.sendEmailCompleted,
                this.sendEmailFailed
            );
        }
    }

    angular
        .module("insite")
        .service("nbfEmailService", NbfEmailService);
}