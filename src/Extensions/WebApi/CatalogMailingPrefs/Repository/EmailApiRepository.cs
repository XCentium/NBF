using System.Collections.Generic;
using System.Dynamic;
using System.Net.Mail;
using System.Threading.Tasks;
using Extensions.WebApi.Base;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Catalog.Services;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Localization;
using Insite.Customers.Services;
using Insite.Data.Repositories.Interfaces;

namespace Extensions.WebApi.CatalogMailingPrefs.Repository
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
            emailModel.FirstName = catalogPrefsDto.firstName;
            emailModel.LastName = catalogPrefsDto.lastName;
            emailModel.Company = catalogPrefsDto.company;
            emailModel.AddressLine1 = catalogPrefsDto.addressLine1;
            emailModel.AddressLine2 = catalogPrefsDto.addressLine2;
            emailModel.City = catalogPrefsDto.city;
            emailModel.State = catalogPrefsDto.state;
            emailModel.Zip = catalogPrefsDto.zip;
            emailModel.PriorityCode = catalogPrefsDto.priorityCode;
            emailModel.Preference = catalogPrefsDto.preference;

            var emailList = _unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("CatalogMailingPreferences", "Catalog Mailing Preferences");
            EmailService.SendEmailList(
                emailList.Id,
                catalogPrefsDto.emailTo.Split(','),
                emailModel,
                $"{EntityTranslationService.TranslateProperty(emailList, o => o.Subject)}: {catalogPrefsDto.preference}",
                _unitOfWork,
                SiteContext.Current.WebsiteDto.Id);

            return Task.FromResult(0);
        }

        public Task SendTaxExemptEmail(TaxExemptDto taxExemptDto)
        {
            dynamic emailModel = new ExpandoObject();
            emailModel.CustomerNumber = taxExemptDto.customerNumber;
            emailModel.CustomerSequence = taxExemptDto.customerSequence;
            emailModel.OrderNumber = taxExemptDto.orderNumber;
            //var attachments = new List<Attachment>()
            //{
            //    taxExemptDto.fileLocation
            //};

            var emailList = _unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("TaxExempt", "Tax Exempt File Submission");
            EmailService.SendEmailList(
                emailList.Id,
                taxExemptDto.emailTo.Split(','),
                emailModel,
                $"{EntityTranslationService.TranslateProperty(emailList, o => o.Subject)}- CustNo: {taxExemptDto.customerNumber} - OrderNo: {taxExemptDto.orderNumber}",
                _unitOfWork,
                SiteContext.Current.WebsiteDto.Id);

            return Task.FromResult(0);
        }
    }
}