using System.Threading.Tasks;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.TaxExempt.Interfaces
{
    public interface ITaxExemptService : IDependency, IExtension
    {
        Task AddTaxExempt(string billToId);
        Task RemoveTaxExempt(string billToId);
    }    
}
