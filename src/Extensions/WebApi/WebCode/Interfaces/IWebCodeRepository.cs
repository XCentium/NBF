using System.Threading.Tasks;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.WebCode.Interfaces
{
    public interface IWebCodeRepository : IExtension, IDependency
    {
        Task<string> GetWebCode(string siteId);
    }
}
