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
        public async Task SendTaxExemptEmail(TaxExemptEmailDto taxExemptDto)
        {
            await _emailApiRepository.SendTaxExemptEmail(taxExemptDto);
        }
        
        [Transaction]
        public async Task SendContactUsSpanishForm(ContactUsSpanishDto contactUsSpanishDto)
        {
            await _emailApiRepository.SendContactUsSpanishForm(contactUsSpanishDto);
        }
    }
}
