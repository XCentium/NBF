using System.Threading.Tasks;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.PriceCode.Interfaces
{
    public interface IPriceCodeRepository : IExtension, IDependency
    {
        Task<string> GetPriceCode(string billToId);
        Task<string> SetPriceCode(string priceCode, string billToId);
    }
}
