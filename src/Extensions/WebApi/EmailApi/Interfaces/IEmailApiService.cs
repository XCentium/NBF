using System.Threading.Tasks;
using Extensions.WebApi.EmailApi.Models;
using Insite.Core.Interfaces.Dependency;
using Insite.Order.WebApi.V1.ApiModels;

namespace Extensions.WebApi.EmailApi.Interfaces
{
    public interface IEmailApiService : IDependency, IExtension
    {
        Task SendCatalogPrefsEmail(CatalogPrefsDto catalogPrefsDto);
        Task SendTaxExemptEmail(TaxExemptDto taxExemptDto);
        Task SendContactUsSpanishForm(ContactUsSpanishDto contactUsSpanishDto);
    }    
}
