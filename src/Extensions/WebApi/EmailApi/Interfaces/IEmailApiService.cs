using System.Threading.Tasks;
using Extensions.WebApi.EmailApi.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.EmailApi.Interfaces
{
    public interface IEmailApiService : IDependency, IExtension
    {
        Task SendCatalogPrefsEmail(CatalogPrefsDto catalogPrefsDto);
        Task SendTaxExemptEmail(TaxExemptDto taxExemptDto);
        Task SendContactUsSpanishForm(ContactUsSpanishDto contactUsSpanishDto);
    }    
}
