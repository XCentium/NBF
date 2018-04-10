using System.Threading.Tasks;
using Extensions.WebApi.EmailApi.Interfaces;
using Extensions.WebApi.EmailApi.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.EmailApi.Services
{
    public class EmailApiService : ServiceBase, IEmailApiService
    {
        private readonly IEmailApiRepository _emailApiRepository;

        public EmailApiService(IUnitOfWorkFactory unitOfWorkFactory, IEmailApiRepository emailApiRepository) : base(unitOfWorkFactory)
        {
            _emailApiRepository = emailApiRepository;
        }
        
        [Transaction]
        public async Task SendCatalogPrefsEmail(CatalogPrefsDto catalogPrefsDto)
        {
            await _emailApiRepository.SendCatalogPrefsEmail(catalogPrefsDto);
        }

        [Transaction]
        public async Task SendTaxExemptEmail(TaxExemptDto taxExemptDto)
        {
            await _emailApiRepository.SendTaxExemptEmail(taxExemptDto);
        }
    }
}
