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
    [DependencyName("CalculateShippingOptions")]
    public sealed class NBFCalculateShippingOptions : HandlerBase<GetCartParameter, GetCartResult>
    {
        private readonly IOrderLineUtilities orderLineUtilities;
        private readonly IPricingPipeline pricingPipeline;
      
        public NBFCalculateShippingOptions(IOrderLineUtilities orderLineUtilities, IPricingPipeline pricingPipeline)
        {
            this.orderLineUtilities = orderLineUtilities;
            this.pricingPipeline = pricingPipeline;
        }

        public override int Order
        {
            get
            {
                return 2299;
            }
        }

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            var additionalCharges = unitOfWork.GetRepository<ShippingChargesRuleModel>().GetTable().ToList();
            var shippingByVendor = ShippingHelper.CalculateShippingByVendor(additionalCharges, result.Cart);

            //If any of the products in cart is non-truck, then only standard shipping option should be available
            if (shippingByVendor.Any(x => x.IsTruck == false)
                && result.Carriers.Any()
                && result.Carriers.Any(x => x.ShipVias.Any(s => s.Description.ToLower() != "standard")))
            {
                foreach (var carrier in result.Carriers)
                {
                    carrier.ShipVias.Remove(carrier.ShipVias.Where(x => x.Description.ToLower() != "standard").First());
                }
            }

            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
