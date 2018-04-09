using Extensions.WebApi.Listrak.Models;
using Insite.Core.Interfaces.Dependency;
using System.Threading.Tasks;

namespace Extensions.WebApi.Listrak.Interfaces
{
    public interface IListrakRepository : IExtension, IDependency
    {
        Task<bool> SendTransactionalEmail(SendTransationalMessageParameter parameter);
        Task<bool> CreateOrUpdateContact(CreateOrUpdateContactParameter parameter);
    }
}
