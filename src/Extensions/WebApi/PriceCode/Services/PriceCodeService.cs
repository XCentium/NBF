using System.Threading.Tasks;
using Extensions.WebApi.PriceCode.Interfaces;
using Extensions.WebApi.PriceCode.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.PriceCode.Services
{
    public class PriceCodeService : ServiceBase, IPriceCodeService
    {
        private readonly IPriceCodeRepository _priceCodeRepository;

        public PriceCodeService(IUnitOfWorkFactory unitOfWorkFactory, IPriceCodeRepository priceCodeRepository) : base(unitOfWorkFactory)
        {
            _priceCodeRepository = priceCodeRepository;
        }

        [Transaction]
        public async Task<GetPriceCodeResult> GetPriceCode(string billToId)
        {
            var result = await Task.FromResult(_priceCodeRepository.GetPriceCode(billToId));
            return result;
        }
        
        [Transaction]
        public async Task<string> SetPriceCode(string priceCode, string value, string billToId)
        {
            var result = await Task.FromResult(_priceCodeRepository.SetPriceCode(priceCode, value, billToId));
            return result;
        }
    }
}
