using System.Threading.Tasks;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.TaxExempt.Interfaces
{
    public interface ITaxExemptRepository : IExtension, IDependency
    {
        Task UpdateBillTo(string billToId);
    }
}
