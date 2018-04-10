using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;
using Extensions.WebApi.Messages.Interfaces;
using Extensions.WebApi.PDF.Models;
using Extensions.WebApi.PDF.Interfaces;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;

namespace Extensions.WebApi.PDF.Controllers
{
    [RoutePrefix("api/nbf/pdf")]
    public class PDFController : BaseApiController
    {
        private readonly IPDFService _ccService;

        public PDFController(ICookieManager cookieManager, IPDFService ccService)
          : base(cookieManager)
        {
            _ccService = ccService;
        }

        [Route("GetPdf", Name = "GetPdf"), HttpPost]
        [ResponseType(typeof(HttpResponseMessage))]
        public HttpResponseMessage CreateMessage(GetPdfParameter parameter)
        {
            var a = this._ccService.GetPdf(parameter);

            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(a)
            };
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("render");
            response.Content.Headers.ContentDisposition.FileName = "ReturnRequest" + DateTime.Now.ToString("ddMMyyyy") + ".pdf";
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            response.Content.Headers.ContentLength = a.Length;
            //using (FileStream file = new FileStream("controller.pdf", FileMode.Create))
            //{
            //    file.Write(m.ToArray(), 0, Convert.ToInt32(m.Length));
            //    m.Seek(0, 0);
            //}
            return response;
        }
    }
}
