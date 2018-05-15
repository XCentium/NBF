﻿using System.Linq;
using System.Threading.Tasks;
using Extensions.WebApi.Base;
using Extensions.WebApi.TaxExempt.Interfaces;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Localization;
using Insite.Customers.Services;
using Insite.Data.Entities;

namespace Extensions.WebApi.TaxExempt.Repository
{
    public class TaxExemptRepository : BaseRepository, ITaxExemptRepository, IInterceptable
    {
        private readonly IUnitOfWork _unitOfWork;
        protected readonly IEmailService EmailService;
        protected readonly IEntityTranslationService EntityTranslationService;

        public TaxExemptRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService,
            IEmailService emailService,
            IEntityTranslationService entityTranslationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            EmailService = emailService;
            EntityTranslationService = entityTranslationService;
        }

        public Task UpdateBillTo(string billToId)
        {
            var billTo = _unitOfWork.GetRepository<Customer>().GetTable().FirstOrDefault(x => x.Id.ToString().Equals(billToId));

            if (billTo != null)
            {
                billTo.TaxCode1 = "NT";
                _unitOfWork.Save();
            }

            return Task.FromResult(0);
        }
    }
}