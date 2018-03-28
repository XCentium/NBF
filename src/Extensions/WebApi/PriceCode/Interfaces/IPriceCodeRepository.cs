using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.PriceCode.Interfaces
{
    public interface IPriceCodeRepository : IExtension, IDependency
    {
        string GetPriceCode(string billToId);
        string SetPriceCode(string priceCode, string billToId);
    }
}
