using System.Dynamic;
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
    public class CatalogMailingPrefsRepository : BaseRepository, ICatalogMailingPrefsRepository, IInterceptable
    {
        private IUnitOfWork _unitOfWork;
        /// <summary>The email service.</summary>
        protected readonly IEmailService EmailService;

        /// <summary>The entity translation service</summary>
        protected readonly IEntityTranslationService EntityTranslationService;

        public CatalogMailingPrefsRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService,
            IEmailService emailService,
            IEntityTranslationService entityTranslationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.EmailService = emailService;
            this.EntityTranslationService = entityTranslationService;
        }

        public Task SendEmail(CatalogPrefsDto catalogPrefsDto)
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

            var emailList = this._unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("CatalogMailingPreferences", "Catalog Mailing Preferences");
            this.EmailService.SendEmailList(
                emailList.Id,
                catalogPrefsDto.emailTo.Split(','),
                emailModel,
                $"{this.EntityTranslationService.TranslateProperty(emailList, o => o.Subject)}: {catalogPrefsDto.preference}",
                this._unitOfWork,
                SiteContext.Current.WebsiteDto.Id);

            return Task.FromResult(0);
        }
    }
}