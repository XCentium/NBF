using Extensions.WebApi.CreditCardTransaction.Models;
using Extensions.WebApi.Messages.Models;
using Insite.Core.Interfaces.Dependency;
using System.Threading.Tasks;

namespace Extensions.WebApi.CreditCardTransaction.Interfaces
{
    public interface ICCTransactionRepository: IExtension, IDependency
    {
        bool AddCCTransaction(AddCCTransactionParameter parameter);
    }
}
