using System.Threading.Tasks;
using Extensions.WebApi.TaxExempt.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.TaxExempt.Services
{
    public class TaxExemptService : ServiceBase, ITaxExemptService
    {
        private readonly ITaxExemptRepository _taxExemptRepository;

        public TaxExemptService(IUnitOfWorkFactory unitOfWorkFactory, ITaxExemptRepository taxExemptRepository) : base(unitOfWorkFactory)
        {
            _taxExemptRepository = taxExemptRepository;
        }
        
        [Transaction]
        public async Task UpdateBillTo(string billToId)
        {
            await _taxExemptRepository.UpdateBillTo(billToId);
        }
    }
}
