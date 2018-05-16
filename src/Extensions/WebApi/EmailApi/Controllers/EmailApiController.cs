using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.EmailApi.Interfaces;
using Extensions.WebApi.EmailApi.Models;
using Insite.Common.Logging;
using Insite.Core.Plugins.StorageProvider;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;

namespace Extensions.WebApi.EmailApi.Controllers
{
    [RoutePrefix("api/nbf/email")]
    public class EmailApiController : BaseApiController
    {
        private readonly IEmailApiService _emailApiService;
        protected readonly IStorageProvider StorageProvider;

        public EmailApiController(ICookieManager cookieManager,
            IEmailApiService emailApiService,
            IStorageProvider storageProvider)
            : base(cookieManager)
        {
            _emailApiService = emailApiService;
            StorageProvider = storageProvider;
        }

        [Route("catalogPrefs", Name = "sendCatalogPrefsEmail")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public async Task<IHttpActionResult> SendCatalogPrefsEmail([FromBody] CatalogPrefsDto catalogPrefsDto)
        {
            await _emailApiService.SendCatalogPrefsEmail(catalogPrefsDto);

            return Ok();
        }

        [Route("contactusspanish", Name = "sendContactUsSpanishForm")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public async Task<IHttpActionResult> SendContactUsSpanishForm([FromBody] ContactUsSpanishDto contactUsSpanishDto)
        {
            await _emailApiService.SendContactUsSpanishForm(contactUsSpanishDto);

            return Ok();
        }

        [Route("taxexempt", Name = "sendTaxExemptEmail")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public async Task<IHttpActionResult> SendTaxExemptEmail([FromBody] TaxExemptEmailDto taxExemptDto)
        {
            await _emailApiService.SendTaxExemptEmail(taxExemptDto);
            return Ok();
        }

        [Route("taxexemptfile", Name = "uploadTaxExemptEmailFile")]
        public async Task<HttpResponseMessage> UploadTaxExemptFile()
        {
            return await ProcessUploadedFile(false);
        }

        [Route("rmafile", Name = "uploadRmaFile")]
        public async Task<HttpResponseMessage> UploadRmaFile()
        {
            return await ProcessUploadedFile(false);
        }

        protected async Task<HttpResponseMessage> ProcessUploadedFile(bool overwriteFile)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var tempUploadDirectory = StorageProvider.Combine(@"_system\fileuploadtemp", Guid.NewGuid().ToString());
            StorageProvider.CreateFolder(tempUploadDirectory);

            try
            {
                var multipart = await Request.Content.ReadAsMultipartAsync();
                var tempFileName = string.Empty;

                if (multipart.Contents[0].Headers.Any(x => x.Key == "Content-Disposition"
                && x.Value.Any(y => y.Contains("filename="))
                ))
                {

                    var destinationFileName = multipart.Contents[0].Headers
                        .FirstOrDefault(o => o.Key == "Content-Disposition").Value
                        .FirstOrDefault(o => o.Contains("filename="))
                        .Split(new string[] { "filename=" }, StringSplitOptions.None)[1].Split(';')[0].Trim();
                    destinationFileName = Uri.UnescapeDataString(destinationFileName);
                    destinationFileName = System.IO.Path.GetInvalidFileNameChars().Aggregate(destinationFileName, (current, c) => current.Replace(c, ' ')).Trim();

                    var destinationFileStream = await multipart.Contents[0].ReadAsStreamAsync();

                    tempFileName = StorageProvider.Combine(tempUploadDirectory, destinationFileName);
                    StorageProvider.SaveStream(tempFileName, destinationFileStream);
                }
                return Request.CreateResponse(HttpStatusCode.OK, tempFileName);
            }
            catch (Exception exception)
            {
                LogHelper.For(this).Error("Exception occurred while uploading files.", exception);

                try
                {
                    StorageProvider.DeleteFolder(tempUploadDirectory);
                }
                catch
                {
                    Thread.Sleep(100);
                    StorageProvider.DeleteFolder(tempUploadDirectory);
                }

                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, exception);
            }
        }

    }
}