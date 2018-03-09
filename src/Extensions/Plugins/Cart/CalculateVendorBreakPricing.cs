using Extensions.Plugins.Cart.Models;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Common.Helpers;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Pricing;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Plugins.Pricing;
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
                return 1690;
            }
        }

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            var param = new GetProductPricingParameter();

            //GetCartPricingResult cartPricing = this.pricingPipeline.GetCartPricing(new GetCartPricingParameter(result.Cart)
            //{
            //    CalculateShipping = true,
            //    CalculateOrderLines = false
            //});

            var productsByVendor = this.GroupProductsByVendor(result);

            GetProductPricingParameter getProductPricingParameter = new GetProductPricingParameter(true)
            {
                PricingServiceParameters = (IDictionary<Guid, PricingServiceParameter>)new Dictionary<Guid, PricingServiceParameter>()
            };
            foreach (var productByVendor in productsByVendor)
            {
                foreach (var orderLine in productByVendor.OrderLines)
                {
                    var originalQty = orderLine.QtyOrdered;
                    var totalqty = productByVendor.OrderLines.Sum(x => x.QtyOrdered);
                    orderLine.QtyOrdered = totalqty;
                    getProductPricingParameter.PricingServiceParameters = new Dictionary<Guid, PricingServiceParameter>();
                      getProductPricingParameter.PricingServiceParameters.Add(orderLine.Id, new PricingServiceParameter(orderLine.Product.Id)
                    {
                        CustomerOrderId = new Guid?(orderLine.CustomerOrderId),
                        OrderLine = orderLine
                    });
                    
                    GetProductPricingResult productPricing = this.pricingPipeline.GetProductPricing(getProductPricingParameter);
                    if (productPricing.ResultCode != ResultCode.Success)
                    {
                        

                    }
                    orderLine.QtyOrdered = originalQty;
                    foreach (KeyValuePair<Guid, ProductPriceDto> productPriceDto1 in (IEnumerable<KeyValuePair<Guid, ProductPriceDto>>)productPricing.ProductPriceDtos)
                    {
                        KeyValuePair<Guid, ProductPriceDto> pricingResult = productPriceDto1;
                        OrderLine orderLine1 = result.Cart.OrderLines.FirstOrDefault<OrderLine>((Func<OrderLine, bool>)(o => o.Id.Equals(pricingResult.Key)));
                        if (orderLine1 != null)
                        {
                            ProductPriceDto productPriceDto2 = pricingResult.Value;
                            orderLine1.UnitListPrice = productPriceDto2.UnitListPrice;
                            orderLine1.UnitRegularPrice = productPriceDto2.UnitRegularPrice;
                            orderLine1.UnitNetPrice = productPriceDto2.UnitNetPrice;
                            
                            //OrderLine orderLine2 = orderLine1;
                            //Decimal unitRegularPrice = orderLine2.UnitRegularPrice;
                            //orderLine2.UnitNetPrice = unitRegularPrice;
                            orderLine1.TotalRegularPrice = this.GetTotalRegularPrice(orderLine1);
                            orderLine1.TotalNetPrice = this.GetTotalNetPrice(orderLine1);
                        }
                        
                    }
                }
            }

            //if (cartPricing.ResultCode != ResultCode.Success)
            //{
            //}
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        private Decimal GetTotalRegularPrice(OrderLine orderLine)
        {
            return NumberHelper.RoundCurrency(orderLine.UnitRegularPrice * orderLine.QtyOrdered);
        }
        private Decimal GetTotalNetPrice(OrderLine orderLine)
        {
            return NumberHelper.RoundCurrency(orderLine.UnitNetPrice * orderLine.QtyOrdered);
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
                    var ol = new OrderLine();
                    ol = line;
                    productByVendor.OrderLines.Add(line);
                    productsByVendor.Add(productByVendor);
                }
            }
            return productsByVendor;
        }
    }
}
