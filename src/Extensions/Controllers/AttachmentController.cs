using System;
using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.WebFramework.Mvc;

namespace Extensions.Controllers
{
    public class AttachmentController : BaseController, IExtension
    {
        private readonly IEmailApiService _emailApiService;

        public AttachmentController(IUnitOfWorkFactory unitOfWorkFactory, IEmailApiService emailApiService)
            : base(unitOfWorkFactory)
        {
            _emailApiService = emailApiService;
        }

        [System.Web.Mvc.HttpPost]
        public virtual ActionResult SendTaxExemptEmail([FromBody] TaxExemptDto taxExemptDto)
        {
            var x = Request.Form;
            HttpPostedFileBase attachment = this.Request.Files["file"];

            if (attachment != null && attachment.ContentLength > 0)
            {
                var path = AppDomain.CurrentDomain.BaseDirectory + @"temp\";
                var location = Path.Combine(path, Path.GetFileName(attachment.FileName));
                attachment.SaveAs(location);
                taxExemptDto.fileLocation = location;
                _emailApiService.SendTaxExemptEmail(taxExemptDto);
            }

            return base.Json(new { Success = true });
        }
    }
}