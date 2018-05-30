module nbf.email {
    import TaxExemptParams = insite.account.TaxExemptParams;
    "use strict";

    export interface INbfEmailService {
        sendCatalogPrefsEmail(params: any): ng.IPromise<string>;
        postTaxExemptFileUpload(params: TaxExemptParams, file: any): ng.IPromise<string>;
        sendTaxExemptEmail(params: TaxExemptParams): ng.IPromise<string>;
        sendContactUsSpanishForm(params: any): ng.IPromise<string>;
        uploadRmaFile(file: any);
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

        sendContactUsSpanishForm(params: any): ng.IPromise<string> {
            const uri = this.serviceUri + "/contactusspanish";

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: uri, method: "POST", data: params }),
                this.sendEmailCompleted,
                this.sendEmailFailed
            );
        }

        postTaxExemptFileUpload(params: TaxExemptParams, file: any): ng.IPromise<string> {
            const fileUri = this.serviceUri + "/taxexemptfile";
            //upload File

            const formData = new FormData();
            formData.append("file", file);

            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ url: fileUri, method: "POST", data: formData, headers: { "Content-Type": undefined } }),
                this.sendEmailCompleted,
                this.sendEmailFailed
            );
        } 

        uploadRmaFile(file: any) {
            const fileUri = this.serviceUri + "/rmafile";

            const formData = new FormData();
            formData.append("file", file);

            const config = {
                headers: { "Content-Type": undefined }
            };

            return this.$http.post(fileUri, formData, config);
        } 

        protected sendEmailCompleted(catalogMailingPrefs: string): void {
            
        }

        protected sendEmailFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
            
        }

        sendTaxExemptEmail(params: TaxExemptParams) : ng.IPromise<string> {
            const uri = this.serviceUri + "/taxexempt";

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