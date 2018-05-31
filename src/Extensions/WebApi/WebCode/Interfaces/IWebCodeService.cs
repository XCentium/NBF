using System.Threading.Tasks;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.WebCode.Interfaces
{
    public interface IWebCodeService : IDependency, IExtension
    {
        Task<string> GetWebCode(string siteId, string userId);
        Task<string> GetWebCodeUserID();

    }
}
