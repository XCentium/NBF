using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.PaymentGateway;
using Insite.Core.Plugins.PaymentGateway.Dtos;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Data.Entities;
using Insite.Payments.Services;
using Insite.Payments.Services.Parameters;
using Insite.Payments.Services.Results;
using System;
using System.Linq;

namespace Extensions.Cart.Handlers
{
    [DependencyName("ProcessCreditCardTransactions")]
    public sealed class ProcessCreditCardTransactions : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        private readonly Lazy<IPaymentService> paymentService;
        private readonly ICustomerOrderUtilities customerOrderUtilities;
        private readonly PaymentSettings paymentSettings;

        public override int Order
        {
            get
            {
                return 2800;
            }
        }

        public ProcessCreditCardTransactions(Lazy<IPaymentService> paymentService, ICustomerOrderUtilities customerOrderUtilities, PaymentSettings paymentSettings)
        {
            this.paymentService = paymentService;
            this.customerOrderUtilities = customerOrderUtilities;
            this.paymentSettings = paymentSettings;
        }

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (!(parameter.Status.EqualsIgnoreCase("Submitted") || parameter.Status.EqualsIgnoreCase("Cart")))
                return this.NextHandler.Execute(unitOfWork, parameter, result);
            CustomerOrder cart = result.GetCartResult.Cart;
            Decimal orderTotalDue;
            if (parameter.CreditCard == null || !parameter.IsPayPal && parameter.CreditCard.CardNumber.IsBlank() && parameter.PaymentProfileId.IsBlank() || (orderTotalDue = this.customerOrderUtilities.GetOrderTotalDue(cart)) <= Decimal.Zero)
                return this.NextHandler.Execute(unitOfWork, parameter, result);
            if (parameter.IsPayPal)
            {
                parameter.CreditCard.CardType = "PayPal";
                parameter.CreditCard.CardHolderName = parameter.PayPalPayerId;
                parameter.CreditCard.SecurityCode = parameter.PayPalToken;
            }

            var remainingBalance = orderTotalDue;
            var paymentsTotal = cart.CreditCardTransactions.Sum(x => x.Amount);
            remainingBalance -= paymentsTotal;
            if (remainingBalance > 0.0m)
            {
                IPaymentService paymentService1 = this.paymentService.Value;
                AddPaymentTransactionParameter parameter1 = new AddPaymentTransactionParameter();
                parameter1.TransactionType = (TransactionType)(this.paymentSettings.SubmitSaleTransaction ? 2 : 0);
                parameter1.ReferenceNumber = cart.OrderNumber;
                Insite.Data.Entities.Currency currency1 = cart.Currency;
                string str1 = (currency1 != null ? currency1.CurrencyCode : (string)null) ?? string.Empty;
                parameter1.CurrencyCode = str1;
                CreditCardDto creditCard1 = parameter.CreditCard;
                parameter1.CreditCard = creditCard1;
                string paymentProfileId = parameter.PaymentProfileId;
                parameter1.PaymentProfileId = paymentProfileId;
                Decimal num = remainingBalance;
                parameter1.Amount = num;
                AddPaymentTransactionResult transactionResult = paymentService1.AddPaymentTransaction(parameter1);
                if (transactionResult.ResultCode != ResultCode.Success)
                    return this.CreateErrorServiceResult<UpdateCartResult>(result, transactionResult.SubCode, transactionResult.Message);
                if (transactionResult.CreditCardTransaction != null)
                    transactionResult.CreditCardTransaction.CustomerOrderId = new Guid?(cart.Id);
            }

            if (parameter.StorePaymentProfile)
            {
                IPaymentService paymentService2 = this.paymentService.Value;
                AddPaymentProfileParameter parameter2 = new AddPaymentProfileParameter();
                parameter2.BillToId = new Guid?(cart.CustomerId);
                Insite.Data.Entities.Currency currency2 = cart.Currency;
                string str2 = currency2 != null ? currency2.CurrencyCode : (string)null;
                parameter2.CurrencyCode = str2;
                CreditCardDto creditCard2 = parameter.CreditCard;
                parameter2.CreditCard = creditCard2;
                paymentService2.AddPaymentProfile(parameter2);
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
