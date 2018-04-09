using Extensions.WebApi.CreditCardTransaction.Interfaces;
using Extensions.WebApi.CreditCardTransaction.Models;
using Extensions.WebApi.Messages.Interfaces;
using Extensions.WebApi.Messages.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Order.Services.Results;
using System.Threading.Tasks;

namespace Extensions.WebApi.Messages.Services
{
    public class CCTransactionService : ServiceBase, ICCTransactionService
    {
        private readonly ICCTransactionRepository _repository;

        public CCTransactionService(IUnitOfWorkFactory unitOfWorkFactory, ICCTransactionRepository repository) : base(unitOfWorkFactory)
        {
            _repository = repository;
        }

        [Transaction]
        public bool AddCCTransaction(AddCCTransactionParameter parameter)
        {
            return this._repository.AddCCTransaction(parameter);
        }
    }
}
