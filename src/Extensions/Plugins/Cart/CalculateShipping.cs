using Extensions.Models.ShippingChargesRule;
using Extensions.Plugins.Cart.Models;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Extensions.Utility.Shipping;

namespace Extensions.Plugins.Cart
{
    [DependencyName("CalculateShipping")]
    public sealed class NBFCalculateShipping : HandlerBase<GetCartParameter, GetCartResult>
    {
        private readonly IOrderLineUtilities orderLineUtilities;
        private readonly IPricingPipeline pricingPipeline;

        private const decimal MinimumTruckAmount = 89.00m;
        private const decimal MinimumNonTruckAmount = 7.95m;
        private const decimal UPSOversizeCharge = 39.95m;
        private const decimal MaxUPSWeight = 999.00m;
        private const decimal ThresholdForWeightBasedFreight = 3500.00m;
        private const decimal LowMerchPctForWeightBased = .12m;
        private const decimal HighMerchPctForWeightBased = .18m;
        private const decimal ShippingChargePerPound = 0.62m;
        private const decimal DiscountPct300to500 = .08m;
        private const decimal DiscountPct500to700 = .15m;

        public NBFCalculateShipping(IOrderLineUtilities orderLineUtilities, IPricingPipeline pricingPipeline)
        {
            this.orderLineUtilities = orderLineUtilities;
            this.pricingPipeline = pricingPipeline;
        }

        public override int Order
        {
            get
            {
                return 1699;
            }
        }

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            //GetCartPricingResult cartPricing = this.pricingPipeline.GetCartPricing(new GetCartPricingParameter(result.Cart)
            //{
            //    CalculateShipping = true,
            //    CalculateOrderLines = false
            //});

            var additionalCharges = unitOfWork.GetRepository<ShippingChargesRuleModel>().GetTable().ToList();
            var shippingByVendor = ShippingHelper.CalculateShippingByVendor(additionalCharges, result.Cart);

            result.Cart.ShippingCharges = Convert.ToDecimal(shippingByVendor.Sum(x => x.BaseShippingCost));
            result.Cart.OtherCharges = Convert.ToDecimal(shippingByVendor.Sum(x => x.AdditonalCharges));
            //result.Cart.ShippingCharges = this.ApplyShippingDiscount(result);

            //if (cartPricing.ResultCode != ResultCode.Success)
            //{
            //}
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
