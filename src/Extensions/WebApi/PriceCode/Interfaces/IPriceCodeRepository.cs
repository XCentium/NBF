using Extensions.WebApi.PriceCode.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.PriceCode.Interfaces
{
    public interface IPriceCodeRepository : IExtension, IDependency
    {
        GetPriceCodeResult GetPriceCode(string billToId);
        string SetPriceCode(string priceCode, string value, string billToId);
    }
}
