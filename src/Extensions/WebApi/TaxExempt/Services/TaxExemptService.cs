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
        public async Task AddTaxExempt(string billToId)
        {
            await _taxExemptRepository.AddTaxExempt(billToId);
        }

        [Transaction]
        public async Task RemoveTaxExempt(string billToId)
        {
            await _taxExemptRepository.RemoveTaxExempt(billToId);
        }
    }
}
