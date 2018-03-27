using System.Threading.Tasks;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.CatalogMailingPrefs.Interfaces
{
    public interface ICatalogMailingPrefsService : IDependency, IExtension
    {
        Task SendEmail(CatalogPrefsDto catalogPrefsDto);
    }    
}
