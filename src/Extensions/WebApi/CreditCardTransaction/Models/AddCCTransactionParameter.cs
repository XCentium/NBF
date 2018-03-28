using Insite.Core.Services;

namespace Extensions.WebApi.CreditCardTransaction.Models
{
    public class AddCCTransactionParameter : ParameterBase
    {
        public string Subject { get; set; }
        public string Message { get; set; }

        public string TargetRole { get; set; }
    }
}
