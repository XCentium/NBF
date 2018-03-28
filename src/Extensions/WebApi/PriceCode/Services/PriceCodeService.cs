using System.Threading.Tasks;
using Extensions.WebApi.PriceCode.Interfaces;
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
        public async Task<string> GetPriceCode(string billToId)
        {
            var result = await Task.FromResult(_priceCodeRepository.GetPriceCode(billToId));
            return result;
        }
        
        [Transaction]
        public async Task<string> SetPriceCode(string priceCode, string billToId)
        {
            var result = await Task.FromResult(_priceCodeRepository.SetPriceCode(priceCode, billToId));
            return result;
        }
    }
}
