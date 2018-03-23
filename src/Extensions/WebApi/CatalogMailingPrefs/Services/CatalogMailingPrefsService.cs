using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.Listrak.Interfaces;
using Extensions.WebApi.Listrak.Models;
using Extensions.WebApi.OrderTracking.Models;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Order.Services.Results;
using Extensions.WebApi.CatalogMailingPrefs.Models;

namespace Extensions.WebApi.CatalogMailingPrefs.Services
{
    public class CatalogMailingPrefsService : ServiceBase, ICatalogMailingPrefsService
    {
        private readonly ICatalogMailingPrefsRepository _CatalogMailingPrefsRepository;

        public CatalogMailingPrefsService(IUnitOfWorkFactory unitOfWorkFactory, ICatalogMailingPrefsRepository CatalogMailingPrefsRepository) : base(unitOfWorkFactory)
        {
            _CatalogMailingPrefsRepository = CatalogMailingPrefsRepository;
        }
        
        [Transaction]
        public async Task SendEmail(CatalogPrefsDto catalogPrefsDto)
        {
            await _CatalogMailingPrefsRepository.SendEmail(catalogPrefsDto);
        }
    }
}
