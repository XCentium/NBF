using System.Threading.Tasks;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.CatalogMailingPrefs.Interfaces
{
    public interface ICatalogMailingPrefsRepository : IExtension, IDependency
    {
        Task SendEmail(CatalogPrefsDto catalogPrefsDto);
    }
}
