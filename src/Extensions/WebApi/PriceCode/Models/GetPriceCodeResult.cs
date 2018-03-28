using Insite.Core.Services;

namespace Extensions.WebApi.PriceCode.Models
{
    public class GetPriceCodeResult : ParameterBase
    {
        public string DisplayName { get; set; }
        public string Value { get; set; }
    }
}