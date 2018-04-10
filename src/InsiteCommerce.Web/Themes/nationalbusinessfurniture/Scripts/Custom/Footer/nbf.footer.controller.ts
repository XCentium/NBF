module nbf.Footer {
    "use strict";

    export class NbfFooterController {

        static $inject = ["$element", "$scope", "nbfPdfService"];

        constructor(
            protected $element: ng.IRootElementService,
            protected $scope: ng.IScope,
            protected nbfPdfService: nbf.pdf.INbfPdfService) {
            this.init();
        }

        init(): void {
            $('.footer-nav__group__title').on('click', function (e) {
                e.preventDefault();
                var p = $(this).parent();
                if (p.hasClass('open')) {
                    p.removeClass('open');
                } else {
                    p.addClass('open');
                }
            });
        }

        getPdfForCurrentPage() {
            alert("getpdf");
            var self = this;
            var data = {};
            data['htmlContent'] = document.body.outerHTML;
            window.console.dir(data);
            data['pageTitle'] = "pageTitle";
            this.nbfPdfService.getPdf(data).success(function (data, status, headers) {
                var octetStreamMime = 'application/pdf';
                var success = false;

                // Get the headers
                var head = headers();
                //get the file name set in content-disposition from the server side
                if (head["content-disposition"]) {
                    var disposition = head["content-disposition"].split(';')[1];
                    disposition = disposition.split('=')[1];
                }
                else {
                    disposition = "testname.pdf";
                }
                var filename = disposition;
                head['content-type'] = octetStreamMime;
                // Determine the content type from the header or default to "application/octet-stream"
                var contentType = head['content-type'] || octetStreamMime;
                try {
                    // Try using msSaveBlob if supported
                    var blob = new Blob([data], { type: contentType });
                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(blob, filename);
                        success = true;
                    } else {
                        console.log("Error: no data.");
                    }
                } catch (ex) {
                    console.log("saveBlob method failed with the following exception:");
                    console.log(ex);
                }

                if (!success) {
                    // Get the blob url creator
                    var urlCreator = window.URL;// || window.webkitURL || window.mozURL || window.msURL;
                    if (urlCreator) {
                        // Try to use a download link
                        var link = document.createElement('a');
                        if ('download' in link) {
                            // Try to simulate a click
                            try {
                                // Prepare a blob URL
                                var blob = new Blob([data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);
                                link.setAttribute('href', url);

                                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                link.setAttribute("download", filename);

                                // Simulate clicking the download link
                                var event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                link.dispatchEvent(event);
                                success = true;

                            } catch (ex) {
                                console.log(ex);
                            }
                        }
                    }
                }
            });
        }

        
    }

    angular
        .module("insite")
        .controller("NbfFooterController", NbfFooterController);
}