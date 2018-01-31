module nbf.SiteMessages {
    "use strict";

    export interface ICommentMessageService {
        
        addComment(params: any): ng.IPromise<string>;
    }

    export class CommentMessageService implements ICommentMessageService {
        serviceUri = "/api/nbf/sitemessages";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: insite.core.HttpWrapperService) {
        }

        addComment(params: any): ng.IHttpPromise<string> {
            var uri = this.serviceUri;
            uri += "/createMessage";
            return this.$http.post(uri, params);
        }

    }

    angular
        .module("insite")
        .service("commentMessageService", CommentMessageService);
}