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

namespace Extensions.Plugins.Cart
{
    [DependencyName("CalculateVendorPricing")]
    public sealed class NBFCalculateVendorPricing : HandlerBase<GetCartParameter, GetCartResult>
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

        public NBFCalculateVendorPricing(IOrderLineUtilities orderLineUtilities, IPricingPipeline pricingPipeline)
        {
            this.orderLineUtilities = orderLineUtilities;
            this.pricingPipeline = pricingPipeline;
        }

        public override int Order
        {
            get
            {
                return 1700;
            }
        }

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            GetCartPricingResult cartPricing = this.pricingPipeline.GetCartPricing(new GetCartPricingParameter(result.Cart)
            {
                CalculateShipping = true,
                CalculateOrderLines = false
            });

            var productsByVendor = this.GroupProductsByVendor(result);

            foreach (var productByVendor in productsByVendor)
            {
                

            }
            
            if (cartPricing.ResultCode != ResultCode.Success)
            {
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        private List<ProductsByVendor> GroupProductsByVendor(GetCartResult result)
        {
            var productsByVendor = new List<ProductsByVendor>();
            foreach (var line in result.Cart.OrderLines)
            {
                if (productsByVendor.FirstOrDefault(x => x.VendorId == line.Product.Vendor.Id) != null)
                {
                    productsByVendor.FirstOrDefault(x => x.VendorId == line.Product.Vendor.Id).OrderLines.Add(line);
                }
                else
                {
                    var productByVendor = new ProductsByVendor();
                    productByVendor.OrderLines = new List<OrderLine>();
                    productByVendor.VendorId = line.Product.VendorId;
                    productByVendor.OrderLines.Add(line);
                    productsByVendor.Add(productByVendor);
                }
            }
            return productsByVendor;
        }
    }
}
