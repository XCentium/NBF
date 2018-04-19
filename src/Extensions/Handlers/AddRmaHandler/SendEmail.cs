using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Emails;
using Insite.Core.Services.Handlers;
using Insite.Data.Repositories.Interfaces;
using Insite.Order.Services.Parameters;
using Insite.Order.Services.Results;
using Insite.Order.SystemSettings;
using System.Dynamic;

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
            var expandoDict = result.EmailModel as IDictionary<String, object>; 

            List<Attachment> attachments = new List<Attachment>();
            if (!string.IsNullOrEmpty(parameter.Notes) && parameter.Notes.Contains("~~"))
            {
                var startPosition = parameter.Notes.IndexOf("~~");

                if (startPosition >= 0)
                {
                    var fileName = parameter.Notes.Substring(startPosition).Replace("~~", "");
                    var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "UserFiles/", fileName);

                    if (File.Exists(filePath))
                    {
                        attachments = new List<Attachment>()
                        {
                            new Attachment(filePath)
                        };
                    }

                    expandoDict["Notes"] = parameter.Notes.Substring(0, startPosition);
                }
            }           

            _emailService.Value.SendEmailList(
                result.EmailList.Id,
                new List<string> { _orderHistorySettings.RmaDestinationEmail //, SiteContext.Current.UserProfileDto.Email
                },
                expandoDict as System.Dynamic.ExpandoObject,
                null,
                unitOfWork,
                SiteContext.Current.WebsiteDto?.Id,
                attachments);

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}