using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using Extensions.WebApi.Base;
using Extensions.WebApi.EmailApi.Interfaces;
using Extensions.WebApi.EmailApi.Models;
using Insite.Catalog.Services;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Localization;
using Insite.Customers.Services;
using Insite.Data.Repositories.Interfaces;

namespace Extensions.WebApi.EmailApi.Repository
{
    public class EmailApiRepository : BaseRepository, IEmailApiRepository, IInterceptable
    {
        private readonly IUnitOfWork _unitOfWork;
        protected readonly IEmailService EmailService;
        protected readonly IEntityTranslationService EntityTranslationService;

        public EmailApiRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService,
            IEmailService emailService,
            IEntityTranslationService entityTranslationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            EmailService = emailService;
            EntityTranslationService = entityTranslationService;
        }

        public Task SendCatalogPrefsEmail(CatalogPrefsDto catalogPrefsDto)
        {
            dynamic emailModel = new ExpandoObject();
            emailModel.FirstName = catalogPrefsDto.FirstName;
            emailModel.LastName = catalogPrefsDto.LastName;
            emailModel.Company = catalogPrefsDto.Company;
            emailModel.Title = catalogPrefsDto.Title;
            emailModel.AddressLine1 = catalogPrefsDto.AddressLine1;
            emailModel.AddressLine2 = catalogPrefsDto.AddressLine2;
            emailModel.City = catalogPrefsDto.City;
            emailModel.State = catalogPrefsDto.State;
            emailModel.Zip = catalogPrefsDto.Zip;
            emailModel.PriorityCode = catalogPrefsDto.PriorityCode;
            emailModel.Preference = catalogPrefsDto.Preference;
            emailModel.RequestorEmail = catalogPrefsDto.RequestorEmail;
            emailModel.RequestorPhone = catalogPrefsDto.RequestorPhone;
            emailModel.SendMeUpdates = catalogPrefsDto.SendMeUpdates;

            var emailList = _unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("CatalogMailingPreferences", "Catalog Mailing Preferences");
            EmailService.SendEmailList(
                emailList.Id,
                catalogPrefsDto.EmailTo.Split(','),
                emailModel,
                $"{EntityTranslationService.TranslateProperty(emailList, o => o.Subject)}: {catalogPrefsDto.Preference}",
                _unitOfWork,
                SiteContext.Current.WebsiteDto.Id);

            return Task.FromResult(0);
        }

        public Task SendTaxExemptEmail(TaxExemptEmailDto taxExemptDto)
        {
            dynamic emailModel = new ExpandoObject();
            emailModel.CustomerNumber = taxExemptDto.CustomerNumber;
            emailModel.CustomerSequence = taxExemptDto.CustomerSequence;
            emailModel.OrderNumber = taxExemptDto.OrderNumber;
            var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "UserFiles/", taxExemptDto.FileLocation);
            var attachments = new List<Attachment>()
            {       
                new Attachment(filePath)
            };

            var emailList = _unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("TaxExempt", "Tax Exempt File Submission", "Tax Exempt File Submission");
            EmailService.SendEmailList(
                emailList.Id,
                taxExemptDto.EmailTo.Split(','),
                emailModel,
                $"{EntityTranslationService.TranslateProperty(emailList, o => o.Subject)} - CustNo: {taxExemptDto.CustomerNumber} - OrderNo: {taxExemptDto.OrderNumber}",
                _unitOfWork,
                SiteContext.Current.WebsiteDto.Id,
                attachments);
            
            if (File.Exists(filePath))
            {
                try
                {
                    Thread.Sleep(10000);
                    attachments.ForEach(x => x.Dispose());
                    File.Delete(filePath);
                }
                catch
                {
                    Thread.Sleep(10000);
                    attachments.ForEach(x => x.Dispose());
                    File.Delete(filePath);
                }
            }

            return Task.FromResult(0);
        }

        public Task SendContactUsSpanishForm(ContactUsSpanishDto contactUsSpanishDto)
        {
            dynamic emailModel = new ExpandoObject();
            emailModel.Name = contactUsSpanishDto.Name;
            emailModel.Company = contactUsSpanishDto.Company;
            emailModel.Zip = contactUsSpanishDto.Zip;
            emailModel.RequestorEmail = contactUsSpanishDto.RequestorEmail;
            emailModel.RequestorPhone = contactUsSpanishDto.RequestorPhone;
            emailModel.ContactMethod = contactUsSpanishDto.ContactMethod;
            emailModel.OrderNumber = contactUsSpanishDto.OrderNumber;
            emailModel.PriorityCode = contactUsSpanishDto.PriorityCode;
            emailModel.Subject = contactUsSpanishDto.Subject;
            emailModel.Comments = contactUsSpanishDto.Comments;
            emailModel.SendMeUpdates = contactUsSpanishDto.SendMeUpdates;

            var emailList = _unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("ContactUsSpanish", "Contact Us");
            EmailService.SendEmailList(
                emailList.Id,
                contactUsSpanishDto.EmailTo.Split(','),
                emailModel,
                "Contact Us Form - Spanish",
                _unitOfWork,
                SiteContext.Current.WebsiteDto.Id);

            return Task.FromResult(0);
        }
    }
}