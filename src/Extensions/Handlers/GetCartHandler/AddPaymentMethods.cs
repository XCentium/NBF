using System;
using System.Linq;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Common.Providers;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Data.Entities;
using Insite.Common.Extensions;
using Insite.Cart.Services.Dtos;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Localization;
using System.Collections.Generic;

namespace Extensions.Handlers.GetCartHandler
{
    [DependencyName("AddPaymentMethods")]
    public sealed class AddPaymentMethods : HandlerBase<GetCartParameter, GetCartResult>
    {
        private readonly Lazy<IEntityTranslationService> entityTranslationService;
        private readonly CartSettings cartSettings;
        private readonly IPricingPipeline pricingPipeline;

        public AddPaymentMethods(Lazy<IEntityTranslationService> entityTranslationService, IPricingPipeline pricingPipeline, CartSettings cartSettings)
        {
            this.pricingPipeline = pricingPipeline;
            this.entityTranslationService = entityTranslationService;
            this.cartSettings = cartSettings;
        }

        public override int Order => 2255;

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            if (!parameter.GetPaymentOptions || SiteContext.Current.BillTo == null)
            {
                return this.NextHandler.Execute(unitOfWork, parameter, result);
            }
            var paymentMethods = new List<PaymentMethodDto>();
            var now = DateTimeProvider.Current.Now;
            unitOfWork.GetRepository<PaymentMethod>().GetTable()
                .Where(o => o.ActivateOn < now && (o.DeactivateOn ?? DateTimeOffset.MaxValue) > now && o.Name.Equals("Open_Credit"))
                .Each(o => paymentMethods.Add(new PaymentMethodDto
                {
                    Name = o.Name,
                    IsCreditCard = o.IsCreditCard,
                    Description = this.entityTranslationService.Value.TranslateProperty(o, x => x.Description)
                }));
            paymentMethods.AddRange(result.PaymentOptions.PaymentMethods);
            result.PaymentOptions.PaymentMethods = paymentMethods;
            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
