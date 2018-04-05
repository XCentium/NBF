using System.Threading.Tasks;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Extensions.WebApi.CatalogMailingPrefs.Models;

namespace Extensions.WebApi.CatalogMailingPrefs.Services
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
