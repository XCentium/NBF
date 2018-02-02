using Extensions.WebApi.Messages.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.Messages.Interfaces
{
    public interface IMessageRepository: IExtension, IDependency
    {
        bool CreateMessage(CreateMessageParameter parameter);
    }
}
