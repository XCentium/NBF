using Insite.Core.Plugins.PaymentGateway.Dtos;
using Insite.Core.Services;
using System;

namespace Extensions.WebApi.CreditCardTransaction.Models
{
    public class AddCCTransactionParameter : ParameterBase
    {
        public CreditCardDto CreditCard { get; set;}
        public string OrderNumber { get; set; }
        public Insite.Data.Entities.Currency Currency { get; set; }
        public string PaymentProfileId { get; set; }
        public Decimal PaymentAmount { get; set; }
    }
}
