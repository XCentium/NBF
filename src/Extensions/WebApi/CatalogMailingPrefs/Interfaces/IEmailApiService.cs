using System.Threading.Tasks;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.CatalogMailingPrefs.Interfaces
{
    public interface IEmailApiService : IDependency, IExtension
    {
        Task SendCatalogPrefsEmail(CatalogPrefsDto catalogPrefsDto);
        Task SendTaxExemptEmail(TaxExemptDto taxExemptDto);
    }    
}
