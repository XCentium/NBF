using System.Threading.Tasks;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.PriceCode.Interfaces
{
    public interface IPriceCodeService : IDependency, IExtension
    {
        Task<string> GetPriceCode(string billToId);
        Task<string> SetPriceCode(string priceCode, string billToId);
    }
}
