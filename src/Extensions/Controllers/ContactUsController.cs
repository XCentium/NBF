using System;
using System.IO;
using System.Web;
using System.Web.Http;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Extensions.WebApi.CatalogMailingPrefs.Models;

namespace Insite.ContentLibrary.Controllers
{
    using System.Dynamic;
    using System.Web.Mvc;

    using Core.Context;
    using Core.Interfaces.Data;
    using Core.Interfaces.Plugins.Emails;
    using Core.Localization;
    using Data.Repositories.Interfaces;
    using WebFramework.Mvc;

    /// <summary>The contact us controller.</summary>
    public class ContactUsController : BaseController
    {
        protected readonly IEmailService EmailService;
        protected readonly IEntityTranslationService EntityTranslationService;
        private readonly IEmailApiService _emailApiService;

        public ContactUsController(
            IUnitOfWorkFactory unitOfWorkFactory,
            IEmailService emailService,
            IEntityTranslationService entityTranslationService,
            IEmailApiService emailApiService)
            : base(unitOfWorkFactory)
        {
            EmailService = emailService;
            EntityTranslationService = entityTranslationService;
        }

        [HttpPost]
        public virtual ActionResult Submit(string firstName, string lastName, string message, string topic, string emailAddress, string emailTo)
        {
            SendEmail(firstName, lastName, message, topic, emailAddress, emailTo);

            return Json(new { Success = true });
        }

        private void SendEmail(string firstName, string lastName, string message, string topic, string emailAddress, string emailTo)
        {
            dynamic emailModel = new ExpandoObject();
            emailModel.FirstName = firstName;
            emailModel.LastName = lastName;
            emailModel.Email = emailAddress;
            emailModel.Topic = topic;
            emailModel.Message = message;

            var emailList = UnitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("ContactUsTemplate", "Contact Us");
            EmailService.SendEmailList(
                emailList.Id,
                emailTo.Split(','),
                emailModel,
                $"{EntityTranslationService.TranslateProperty(emailList, o => o.Subject)}: {topic}",
                UnitOfWork,
                SiteContext.Current.WebsiteDto.Id);
        }

        [HttpPost]
        public virtual ActionResult SendTaxExemptEmail([FromBody] TaxExemptDto taxExemptDto)
        {
            HttpPostedFileBase attachment = Request.Files["file"];

            if (attachment != null && attachment.ContentLength > 0)
            {
                var path = AppDomain.CurrentDomain.BaseDirectory + @"temp\";
                var location = Path.Combine(path, Path.GetFileName(attachment.FileName));
                attachment.SaveAs(location);
                taxExemptDto.fileLocation = location;
                _emailApiService.SendTaxExemptEmail(taxExemptDto);
            }

            return Json(new { Success = true });
        }
    }
}