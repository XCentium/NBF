using Extensions.WebApi.CreditCardTransaction.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.CreditCardTransaction.Interfaces
{
    public interface ICCTransactionService : IDependency, IExtension
    {
        bool AddCCTransaction(AddCCTransactionParameter parameter);
    }
}
