//using Insite.Common;
//using Insite.Core.Interfaces.Data;
//using Insite.Core.Interfaces.Plugins.Emails;
//using Insite.Data.Entities;
//using System;
//using System.Collections.Generic;
//using System.Dynamic;
//using System.Linq;
//using System.Linq.Expressions;
//using System.Net.Mail;
//using Insite.Plugins.Emails;
//using Insite.Data.Extensions;
//using Insite.Core.Localization;
//using Insite.Core.Plugins.EntityUtilities;
//using Insite.Core.SystemSetting.Groups.SiteConfigurations;

//namespace Extensions.Plugins.Emails
//{
//    /// <summary>Service that offers functions for sending emails and parsing email templates</summary>
//    public class NBFEmailService : EmailService
//    {
//        public NBFEmailService(IEmailTemplateUtilities emailTemplateUtilities, IContentManagerUtilities contentManagerUtilities, IEntityTranslationService entityTranslationService, EmailsSettings emailsSettings, Lazy<Insite.WebFramework.Templating.IEmailTemplateRenderer> emailTemplateRenderer) 
//            : base(emailTemplateUtilities, contentManagerUtilities, entityTranslationService, emailsSettings, emailTemplateRenderer)

//        {
//        }

//        public override void SendEmailList(Guid emailListId, IList<string> toAddresses, ExpandoObject templateModel, string subject, IUnitOfWork unitOfWork, Guid? templateWebsiteId = null, IList<Attachment> attachments = null)
//        {
//            foreach (string toAddress in (IEnumerable<string>)toAddresses)
//            {
//                if (!RegularExpressionLibrary.IsValidEmail(toAddress))
//                    throw new ArgumentException("To address: " + toAddress + " is not a valid email address.");
//            }
//            EmailList emailList = unitOfWork.GetRepository<EmailList>().GetTable().Expand<EmailList, EmailTemplate>((Expression<Func<EmailList, EmailTemplate>>)(x => x.EmailTemplate)).FirstOrDefault<EmailList>((Expression<Func<EmailList, bool>>)(x => x.Id == emailListId));
//            SendEmailParameter sendEmailParamter = new SendEmailParameter()
//            {
//                ToAddresses = toAddresses,
//                Attachments = attachments
//            };
//            string defaultEmail = this.EmailsSettings.DefaultEmail;
//            if (emailList == null)
//                return;
//            sendEmailParamter.FromAddress = emailList.FromAddress.IsBlank() ? defaultEmail : emailList.FromAddress;
//            SendEmailParameter sendEmailParameter = sendEmailParamter;
//            string str;
//            if (!subject.IsBlank())
//                str = subject;
//            else
//                str = this.EntityTranslationService.TranslateProperty<EmailList>(emailList, (Expression<Func<EmailList, string>>)(o => o.Subject));
//            sendEmailParameter.Subject = str;
//            this.ParseAndSendEmail(this.GetHtmlTemplate(emailList, templateWebsiteId), templateModel, sendEmailParamter, unitOfWork);
//        }
//    }
//}
