using Insite.Core.Services;

namespace Extensions.WebApi.PriceCode.Models
{
    public class SetPriceCodeRequest : ParameterBase
    {
        public string BillToId { get; set; }
        public string PriceCode { get; set; }
        public string DisplayName { get; set; }
    }
}