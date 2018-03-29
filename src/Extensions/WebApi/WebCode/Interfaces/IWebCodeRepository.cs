using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.WebCode.Interfaces
{
    public interface IWebCodeRepository : IExtension, IDependency
    {
        string GetWebCode(string siteId);
    }
}
