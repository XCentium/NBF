using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;

namespace Extensions.WebApi.CatalogMailingPrefs.Controllers
{
    [RoutePrefix("api/nbf/email")]
    public class EmailApiController : BaseApiController
    {
        private readonly IEmailApiService _emailApiService;

        public EmailApiController(ICookieManager cookieManager, IEmailApiService emailApiService)
            : base(cookieManager)
        {
            _emailApiService = emailApiService;
        }

        [Route("catalogPrefs", Name = "sendCatalogPrefsEmail")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public async Task<IHttpActionResult> SendCatalogPrefsEmail([FromBody] CatalogPrefsDto catalogPrefsDto)
        {
            await _emailApiService.SendCatalogPrefsEmail(catalogPrefsDto);

            return Ok();
        }

        [Route("taxexempt", Name = "sendTaxExemptEmail")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public async Task<IHttpActionResult> SendTaxExemptEmail([FromBody] TaxExemptDto taxExemptDto)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotAcceptable,
                    "This request is not properly formatted - not multipart."));
            }

            var provider = new RestrictiveMultipartMemoryStreamProvider();

            //READ CONTENTS OF REQUEST TO MEMORY WITHOUT FLUSHING TO DISK
            await Request.Content.ReadAsMultipartAsync(provider);

            foreach (HttpContent ctnt in provider.Contents)
            {
                //now read individual part into STREAM
                var stream = await ctnt.ReadAsStreamAsync();

                if (stream.Length != 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        await _emailApiService.SendTaxExemptEmail(taxExemptDto);
                    }
                }
            }
            return Ok();
        }
    }
    
    public class RestrictiveMultipartMemoryStreamProvider : MultipartMemoryStreamProvider
    {
        public override Stream GetStream(HttpContent parent, HttpContentHeaders headers)
        {
            var extensions = new[] {"pdf", "doc"};
            var filename = headers.ContentDisposition.FileName.Replace("\"", string.Empty);

            if (filename.IndexOf('.') < 0)
                return Stream.Null;

            var extension = filename.Split('.').Last();

            return extensions.Any(i => i.Equals(extension, StringComparison.InvariantCultureIgnoreCase))
                ? base.GetStream(parent, headers)
                : Stream.Null;

        }
    }
}