using Extensions.WebApi.CreditCardTransaction.Interfaces;
using Extensions.WebApi.CreditCardTransaction.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.CreditCardTransaction.Services
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
            return _repository.AddCCTransaction(parameter);
        }
    }
}
