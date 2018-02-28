using Extensions.WebApi.Messages.Models;
using Insite.Core.Interfaces.Dependency;
using Insite.Order.Services.Results;
using System.Threading.Tasks;

namespace Extensions.WebApi.Messages.Interfaces
{
    public interface IMessagesService : IDependency, IExtension
    {
        bool CreateMessage(CreateMessageParameter parameter);
    }
}
