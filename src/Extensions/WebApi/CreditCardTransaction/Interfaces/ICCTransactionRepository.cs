using Extensions.WebApi.CreditCardTransaction.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.CreditCardTransaction.Interfaces
{
    public interface ICCTransactionRepository: IExtension, IDependency
    {
        bool AddCCTransaction(AddCCTransactionParameter parameter);
    }
}
