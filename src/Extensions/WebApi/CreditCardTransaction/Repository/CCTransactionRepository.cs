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
using Insite.Payments.Services.Parameters;
using Insite.Payments.Services.Results;
using Insite.Core.Plugins.PaymentGateway.Dtos;
using Insite.Core.Services;

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
            IPaymentService paymentService1 = this.paymentService.Value;
            AddPaymentTransactionParameter parameter1 = new AddPaymentTransactionParameter();
            parameter1.TransactionType =  0; 
            parameter1.ReferenceNumber = parameter.OrderNumber;
            //SiteContext siteContext = new ISiteContext();
            ISiteContext siteContext = SiteContext.Current;
            var currency1 = siteContext.CurrencyDto;
            string str1 = (currency1 != null ? currency1.CurrencyCode : (string)null) ?? string.Empty;
            parameter1.CurrencyCode = str1;
            CreditCardDto creditCard1 = parameter.CreditCard;
            parameter1.CreditCard = creditCard1;

            //string paymentProfileId = parameter.PaymentProfileId;
            //parameter1.PaymentProfileId = paymentProfileId;
            Decimal num = parameter.PaymentAmount;
            parameter1.Amount = num;
            AddPaymentTransactionResult transactionResult = paymentService1.AddPaymentTransaction(parameter1);
            if (transactionResult.ResultCode != ResultCode.Success)
            {
                return false;
            }
            return true;
        }
    }
}