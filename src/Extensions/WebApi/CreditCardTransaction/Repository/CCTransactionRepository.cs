using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Customers.Services;
using Insite.Core.Interfaces.Plugins.Security;
using Extensions.WebApi.Base;
using System;
using Insite.Core.Context;
using Extensions.WebApi.CreditCardTransaction.Interfaces;
using Insite.Payments.Services;
using Extensions.WebApi.CreditCardTransaction.Models;
using Insite.Payments.Services.Parameters;
using Insite.Payments.Services.Results;
using Insite.Core.Plugins.PaymentGateway.Dtos;
using Insite.Core.Services;
using Insite.Cart.Services;
using Insite.Cart.Services.Results;
using Insite.Cart.Services.Parameters;
using System.Linq;

namespace Extensions.WebApi.CreditCardTransaction.Repository
{
    public class CCTransactionRepository : BaseRepository, ICCTransactionRepository, IInterceptable
    {
        private const bool IgnoreCase = true;
        private IUnitOfWork UnitOfWork;
        private readonly Lazy<IPaymentService> paymentService;
        private readonly ICartService cartService;

        public CCTransactionRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService, Lazy<IPaymentService> paymentService, ICartService cartService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.paymentService = paymentService;
            this.cartService = cartService;
        }

        public bool AddCCTransaction(AddCCTransactionParameter parameter)
        {
            IPaymentService paymentService1 = this.paymentService.Value;
            AddPaymentTransactionParameter parameter1 = new AddPaymentTransactionParameter();
            parameter1.TransactionType = 0;
            parameter1.ReferenceNumber = parameter.OrderNumber;
            //SiteContext siteContext = new ISiteContext();
            ISiteContext siteContext = SiteContext.Current;
            var currency1 = siteContext.CurrencyDto;
            string str1 = (currency1 != null ? currency1.CurrencyCode : (string)null) ?? string.Empty;
            parameter1.CurrencyCode = str1;
            CreditCardDto creditCard1 = parameter.CreditCard;
            parameter1.CreditCard = creditCard1;
            var orderId = "";
            ICartService cartService = this.cartService;
            GetCartParameter parameter2 = new GetCartParameter();
            if (parameter.CartId.EqualsIgnoreCase("current"))
            {
                parameter2.CartId = new Guid?();
            } else
            {
                parameter2.CartId = new Guid(parameter.CartId);
            }
            GetCartResult cart = cartService.GetCart(parameter2);

            //string paymentProfileId = parameter.PaymentProfileId;
            //parameter1.PaymentProfileId = paymentProfileId;
            Decimal num = parameter.PaymentAmount;
            parameter1.Amount = num;
            AddPaymentTransactionResult transactionResult = paymentService1.AddPaymentTransaction(parameter1);
            var returnValue = true;
            if (transactionResult.ResultCode != ResultCode.Success)
            {
                returnValue = false;
            }
            var transaction = this.UnitOfWork.GetRepository<Insite.Data.Entities.CreditCardTransaction>().GetTable()
                .Where(x => x.OrderNumber == parameter.OrderNumber && x.CustomerOrderId == null && x.Result == "0").FirstOrDefault();
            if (transaction != null)
            {
                transaction.CustomerOrderId = cart.Cart.Id;
                this.UnitOfWork.Save();
            }
            return returnValue;
        }
    }
}