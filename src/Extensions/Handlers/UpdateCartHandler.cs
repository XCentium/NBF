namespace Extensions.Handlers
{
    using System;

    using Insite.Cart.Services.Parameters;
    using Insite.Cart.Services.Results;
    using Insite.Core.Context;
    using Insite.Core.Interfaces.Data;
    using Insite.Core.Interfaces.Dependency;
    using Insite.Core.Interfaces.Plugins.Emails;
    using Insite.Core.Plugins.Emails;
    using Insite.Core.Services.Handlers;
    using Insite.Data.Entities;
    using Insite.Data.Repositories.Interfaces;
    using Insite.Cart.Services.Handlers.UpdateCartHandler;
    using System.Threading.Tasks;
    using Helpers;
    using WebApi.Listrak.Models;
    using Enums.Listrak.Fields;

    [DependencyName(nameof(SendConfirmationEmail))]
    public sealed class NBFSendConfirmationEmail : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        public override int Order => 3200;

        private readonly Lazy<IBuildEmailValues> buildEmailValues;

        public NBFSendConfirmationEmail(Lazy<IBuildEmailValues> buildEmailValues, Lazy<IEmailService> emailService)
        {
            this.buildEmailValues = buildEmailValues;
        }

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (!parameter.Status.EqualsIgnoreCase(CustomerOrder.StatusType.Submitted))
            {
                return this.NextHandler.Execute(unitOfWork, parameter, result);
            }
            
            var toAddresses = this.buildEmailValues.Value.BuildOrderConfirmationEmailToList(result.GetCartResult.Cart.Id);

            var sendEmailResult = this.SendConfirmationEmail(result);

            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        private async Task<bool> SendConfirmationEmail(UpdateCartResult result)
        {
            var param = new SendTransationalMessageParameter();
            var field = new SegmentationFieldParameter();
            param.SegmentationFields = new System.Collections.Generic.List<SegmentationFieldParameter>();
            field.SegmentationFieldId = WelcomeEmailFieldEnum.FirstName.GetId();
            field.Value = NBFHtmlHelper.GetBillToShipToHtml(result);
            param.SegmentationFields.Add(field);
            param.Message = Enums.Listrak.TransactionalMessageEnum.OrderConfirmation;
            param.EmailAddress = "n.t.agnos@gmail.com";
            var service = new NBFListrakHelper();
            return await service.SendTransactionalEmail(param);
        }
    }
}