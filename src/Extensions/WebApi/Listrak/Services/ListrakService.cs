using Extensions.WebApi.Listrak.Interfaces;
using Extensions.WebApi.Listrak.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Order.Services.Results;
using System.Threading.Tasks;

namespace Extensions.WebApi.Listrak.Services
{
    public class ListrakService : ServiceBase, IListrakService
    {
        private readonly IListrakRepository _repository;

        public ListrakService(IUnitOfWorkFactory unitOfWorkFactory, IListrakRepository repository) : base(unitOfWorkFactory)
        {
            _repository = repository;
        }

        [Transaction]
        public async Task<bool> SendTransationalMessage(SendTransationalMessageParameter parameter)
        {
            var result = await this._repository.SendTransactionalEmail(parameter);
            return result;
        }

        [Transaction]
        public async Task<bool> CreateOrUpdateContact(CreateOrUpdateContactParameter parameter)
        {
            var result = await this._repository.CreateOrUpdateContact(parameter);
            return result;
        }
    }
}
