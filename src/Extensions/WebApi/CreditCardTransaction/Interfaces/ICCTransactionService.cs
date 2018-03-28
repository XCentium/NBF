using Extensions.WebApi.CreditCardTransaction.Models;
using Extensions.WebApi.Messages.Models;
using Insite.Core.Interfaces.Dependency;
using Insite.Order.Services.Results;
using System.Threading.Tasks;

namespace Extensions.WebApi.CreditCardTransaction.Interfaces
{
    public interface ICCTransactionService : IDependency, IExtension
    {
        bool AddCCTransaction(AddCCTransactionParameter parameter);
    }
}
