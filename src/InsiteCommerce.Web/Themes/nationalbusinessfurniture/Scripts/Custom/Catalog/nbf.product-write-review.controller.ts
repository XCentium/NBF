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
                api_key: '56b8fc6a-79a7-421e-adc5-36cbdaec7daf',
                locale: 'en_US',
                merchant_group_id: '47982',
                merchant_id: '33771',
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