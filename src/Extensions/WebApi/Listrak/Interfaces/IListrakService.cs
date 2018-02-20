using Extensions.WebApi.Listrak.Models;
using Insite.Core.Interfaces.Dependency;
using System.Threading.Tasks;

namespace Extensions.WebApi.Listrak.Interfaces
{
    public interface IListrakService : IDependency, IExtension
    {
        Task<bool> SendTransationalMessage(SendTransationalMessageParameter parameter);
    }
}
