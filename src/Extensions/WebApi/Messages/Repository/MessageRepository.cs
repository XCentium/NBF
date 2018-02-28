using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Customers.Services;
using Insite.Core.Interfaces.Plugins.Security;
using Extensions.WebApi.Base;
using Extensions.WebApi.Messages.Models;
using System;
using Insite.Core.Context;
using Insite.Data.Entities;
using Extensions.WebApi.Messages.Interfaces;
using Extensions.Handlers.Interfaces;
using Extensions.Handlers.Helpers;
using System.Threading.Tasks;
using Extensions.WebApi.Listrak.Services;
using Extensions.WebApi.Listrak.Models;
using Extensions.WebApi.Listrak.Repository;
using Extensions.Enums.Listrak.Fields;

namespace Extensions.WebApi.Messages.Repository
{
    public class MessageRepository : BaseRepository, IMessageRepository, IInterceptable
    {
        private const bool IgnoreCase = true;
        private IUnitOfWork UnitOfWork;
        protected readonly Lazy<INbfListrakHelper> GetListrakHelper;

        public MessageRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService, Lazy<INbfListrakHelper> getListrakHelper)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.GetListrakHelper = getListrakHelper;
        }

        public bool CreateMessage(CreateMessageParameter parameter)
        {
            IRepository<Insite.Data.Entities.Message> repository = UnitOfWork.GetRepository<Insite.Data.Entities.Message>();
            Insite.Data.Entities.Message message = repository.Create();
            message.LanguageId = new Guid?(SiteContext.Current.LanguageDto.Id);
            message.Subject = parameter.Subject;
            message.Body = parameter.Message;

            MessageTarget messageTarget = UnitOfWork.GetRepository<MessageTarget>().Create();
            messageTarget.TargetType = "Role";
            messageTarget.TargetKey = string.IsNullOrEmpty(parameter.TargetRole) ? "Administrator" : parameter.TargetRole;
            message.MessageTargets.Add(messageTarget);

            message.MessageTargets.Add(messageTarget);
            Insite.Data.Entities.Message inserted = message;
            repository.Insert(inserted);
            UnitOfWork.Save();
            return true;
        }
    }
}