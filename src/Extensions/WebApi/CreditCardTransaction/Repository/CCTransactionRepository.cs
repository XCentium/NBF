using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Customers.Services;
using Insite.Core.Interfaces.Plugins.Security;
using Extensions.WebApi.Base;
using Extensions.WebApi.Messages.Models;
using System;
using Insite.Core.Context;
using Insite.Data.Entities;
using Extensions.WebApi.Messages.Interfaces;
using Extensions.Handlers.Interfaces;
using Extensions.Handlers.Helpers;
using System.Threading.Tasks;
using Extensions.WebApi.Listrak.Services;
using Extensions.WebApi.Listrak.Models;
using Extensions.WebApi.Listrak.Repository;
using Extensions.Enums.Listrak.Fields;
using Extensions.WebApi.CreditCardTransaction.Interfaces;
using Insite.Payments.Services;
using Extensions.WebApi.CreditCardTransaction.Models;

namespace Extensions.WebApi.CreditCardTransaction.Repository
{
    public class CCTransactionRepository : BaseRepository, ICCTransactionRepository, IInterceptable
    {
        private const bool IgnoreCase = true;
        private IUnitOfWork UnitOfWork;
        private readonly Lazy<IPaymentService> paymentService;

        public CCTransactionRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService, Lazy<IPaymentService> paymentService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.paymentService = paymentService;
        }

        public bool AddCCTransaction(AddCCTransactionParameter parameter)
        {
            return true;
        }
    }
}