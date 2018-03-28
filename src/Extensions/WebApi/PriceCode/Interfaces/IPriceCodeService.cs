using System.Threading.Tasks;
using Extensions.WebApi.PriceCode.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.PriceCode.Interfaces
{
    public interface IPriceCodeService : IDependency, IExtension
    {
        Task<GetPriceCodeResult> GetPriceCode(string billToId);
        Task<string> SetPriceCode(string priceCode, string value, string billToId);
    }
}
