using Insite.ContentLibrary.Controllers;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Localization;
using Insite.Data.Repositories.Interfaces;
using System.Dynamic;
using System.Linq;
using System.Web.Mvc;

namespace Extensions.Controllers
{
    using System.Dynamic;
    using System.Web.Mvc;

    using Insite.Core.Context;
    using Insite.Core.Interfaces.Data;
    using Insite.Core.Interfaces.Plugins.Emails;
    using Insite.Core.Localization;
    using Insite.Data.Repositories.Interfaces;
    using Insite.WebFramework.Mvc;

    /// <summary>The contact us controller.</summary>
    public class CatalogMailingPrefsController : BaseController
    {
        /// <summary>The email service.</summary>
        protected readonly IEmailService EmailService;

        /// <summary>The entity translation service</summary>
        protected readonly IEntityTranslationService EntityTranslationService;

        /// <summary>Initializes a new instance of the <see cref="ContactUsController"/> class.</summary>
        /// <param name="unitOfWorkFactory">The unit of work factory.</param>
        /// <param name="emailService">The email service.</param>
        /// <param name="entityTranslationService">The entity translation service.</param>
        public CatalogMailingPrefsController(
            IUnitOfWorkFactory unitOfWorkFactory,
            IEmailService emailService,
            IEntityTranslationService entityTranslationService)
            : base(unitOfWorkFactory)
        {
            this.EmailService = emailService;
            this.EntityTranslationService = entityTranslationService;
        }

        /// <summary>The submit.</summary>
        /// <param name="firstName">The first name.</param>
        /// <param name="lastName">The last name.</param>
        /// <param name="message">The message.</param>
        /// <param name="topic">The topic.</param>
        /// <param name="emailAddress">The email address.</param>
        /// <param name="emailTo">The email to.</param>
        /// <returns>The <see cref="ActionResult"/>.</returns>
        [HttpPost]
        public virtual ActionResult Submit(string firstName, string lastName, string message, string topic, string emailAddress, string emailTo)
        {
            // TODO ISC-4563
            // TODO 3.7.1 validate that the emailTo coming in is valid? this could be a security hole
            // TODO 3.7.1 server side validation?
            this.SendEmail(firstName, lastName, message, topic, emailAddress, emailTo);

            return this.Json(new { Success = true });
        }

        private void SendEmail(string firstName, string lastName, string message, string topic, string emailAddress, string emailTo)
        {
            dynamic emailModel = new ExpandoObject();
            emailModel.FirstName = firstName;
            emailModel.LastName = lastName;
            emailModel.Email = emailAddress;
            emailModel.Topic = topic;
            emailModel.Message = message;

            // TODO 4.0: Rename this to ContactUs
            var emailList = this.UnitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("ContactUsTemplate", "Contact Us");
            this.EmailService.SendEmailList(
                emailList.Id,
                emailTo.Split(','),
                emailModel,
                $"{this.EntityTranslationService.TranslateProperty(emailList, o => o.Subject)}: {topic}",
                this.UnitOfWork,
                SiteContext.Current.WebsiteDto.Id);
        }
    }
}