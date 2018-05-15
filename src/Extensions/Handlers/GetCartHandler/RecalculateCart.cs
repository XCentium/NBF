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

namespace Extensions.Handlers.GetCartHandler
{
    [DependencyName("RecalculateCart")]
    public sealed class RecalculateCart : HandlerBase<GetCartParameter, GetCartResult>
    {
        private readonly CartSettings cartSettings;
        private readonly IPricingPipeline pricingPipeline;

        public RecalculateCart(IPricingPipeline pricingPipeline, CartSettings cartSettings)
        {
            this.pricingPipeline = pricingPipeline;
            this.cartSettings = cartSettings;
        }

        public override int Order => 900;

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            if (!result.Cart.OrderLines.Any())
                return NextHandler.Execute(unitOfWork, parameter, result);
            if (result.Cart.Status != "Cart" && result.Cart.Status != "AwaitingApproval")
                return NextHandler.Execute(unitOfWork, parameter, result);
            var lastPricingOn = result.Cart.LastPricingOn;
            if (lastPricingOn.HasValue && !SiteContext.Current.BillTo.TaxCode1.Equals("NT", StringComparison.CurrentCultureIgnoreCase))
            {
                lastPricingOn = result.Cart.LastPricingOn;
                if (lastPricingOn != null && lastPricingOn.Value.DateTime.AddMinutes(cartSettings.MinutesBeforeRecalculation) > DateTimeProvider.Current.Now)
                    return NextHandler.Execute(unitOfWork, parameter, result);
            }
            result.Cart.ShippingCalculationNeededAsOf = DateTimeProvider.Current.Now;
            result.Cart.RecalculateTax = true;
            if (result.Cart.Type != "Quote" && result.Cart.Type != "Job")
                result.Cart.RecalculatePromotions = true;
            var cartPricing = pricingPipeline.GetCartPricing(new GetCartPricingParameter(result.Cart));
            if (cartPricing.ResultCode == ResultCode.Success)
            {
                result.Cart = cartPricing.Cart;
                result.CartNotPriced = false;
            }
            else
            {
                result.CanCheckOut = false;
                result.CartNotPriced = true;
                CopyMessages(cartPricing, result);
            }
            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
