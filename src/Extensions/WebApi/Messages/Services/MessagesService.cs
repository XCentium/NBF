using Extensions.WebApi.Messages.Interfaces;
using Extensions.WebApi.Messages.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Order.Services.Results;
using System.Threading.Tasks;

namespace Extensions.WebApi.Messages.Services
{
    public class MessagesService : ServiceBase, IMessagesService
    {
        private readonly IMessageRepository _repository;

        public  MessagesService(IUnitOfWorkFactory unitOfWorkFactory, IMessageRepository repository) : base(unitOfWorkFactory)
        {
            _repository = repository;
        }

        [Transaction]
        public bool CreateMessage(CreateMessageParameter parameter)
        {
            return this._repository.CreateMessage(parameter);
        }
    }
}
