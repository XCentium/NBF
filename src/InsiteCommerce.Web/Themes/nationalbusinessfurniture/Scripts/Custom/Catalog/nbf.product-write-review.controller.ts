module insite.catalog {
    "use strict";

    export class NbfProductWriteReviewController {
       
        static $inject = [
            "$scope",     
            "$window",
            "queryString"            
        ];

        constructor(
            protected $scope: ng.IScope,    
            protected $window: ng.IWindowService,
            protected queryString: common.IQueryStringService
        ) {
            this.init();
            
        }

        protected init(): void {
            setTimeout(() => {
                this.setPowerReviews();
            }, 1000);
        }

        protected setPowerReviews() {
            let powerReviewsConfig = {
                api_key: this.queryString.get('pr_api_key'),
                locale: 'en_US',
                merchant_group_id: this.queryString.get('pr_merchant_group_id'),
                merchant_id: this.queryString.get('pr_merchant_id'),
                page_id: this.queryString.get('pr_page_id'),
                components: {
                    Write: 'pr-write'
                }
            };

            let powerReviews = this.$window["POWERREVIEWS"];
            powerReviews.display.render(powerReviewsConfig)
        }
    }

    angular
        .module("insite")
        .controller("NbfProductWriteReviewController", NbfProductWriteReviewController);
}