using System;
using System.Collections.Generic;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Services.Handlers;
using Insite.Data.Repositories.Interfaces;
using Insite.Order.Services.Parameters;
using Insite.Order.Services.Results;
using Insite.Order.SystemSettings;

namespace Extensions.Handlers.AddRmaHandler
{
    [DependencyName(nameof(SendEmail))]
    public sealed class SendEmail : HandlerBase<AddRmaParameter, AddRmaResult>
    {
        private readonly Lazy<IEmailService> _emailService;

        private readonly OrderHistorySettings _orderHistorySettings;

        public SendEmail(Lazy<IEmailService> emailService, OrderHistorySettings orderHistorySettings)
        {
            _emailService = emailService;
            _orderHistorySettings = orderHistorySettings;
        }

        public override int Order => 800;

        public override AddRmaResult Execute(IUnitOfWork unitOfWork, AddRmaParameter parameter, AddRmaResult result)
        {
            result.EmailList = unitOfWork.GetTypedRepository<IEmailListRepository>().GetOrCreateByName("RequestRma", "Request RMA");

            _emailService.Value.SendEmailList(
                result.EmailList.Id,
                new List<string> { _orderHistorySettings.RmaDestinationEmail, SiteContext.Current.UserProfileDto.Email },
                result.EmailModel,
                null,
                unitOfWork,
                SiteContext.Current.WebsiteDto?.Id);

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}