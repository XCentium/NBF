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
                var vendorMerchTotal = productByVendor.OrderLines.Sum(x => x.TotalNetPrice);
                productByVendor.IsTruck = (productByVendor.OrderLines.Where(x => x.QtyOrdered > Convert.ToDecimal(x.Product.QtyPerShippingPackage)).FirstOrDefault() != null);

                productByVendor.VendorTotalShippingCharges = GetShippingCharges(productByVendor);

                if (vendorMerchTotal < ThresholdForWeightBasedFreight) // Not weight based
                {
                    var minimumShippingCost = (productByVendor.IsTruck) ? MinimumTruckAmount : MinimumNonTruckAmount;
                    
                    if (productByVendor.VendorTotalShippingCharges < minimumShippingCost)
                    {
                        productByVendor.VendorTotalShippingCharges = minimumShippingCost;
                    }
                }
                else // Weight based
                {

                    if (result.Cart.ShippingCharges > 0)
                    {
                        productByVendor.VendorTotalShippingCharges = this.ApplyShippingDiscount(productByVendor);
                        GetWeightBasedShippingCharges(productByVendor);
                    }
                }


                if (!productByVendor.IsTruck)
                {
                    productByVendor.IsTruck = (productByVendor.OrderLines.Where(x => x.QtyOrdered > Convert.ToDecimal(x.Product.QtyPerShippingPackage)).FirstOrDefault() != null);
                }
                
                if (productByVendor.IsTruck)
                {
                    productByVendor.VendorTotalShippingCharges = GetShippingCharges(productByVendor);
                    productByVendor.VendorTotalShippingCharges = ApplyShippingDiscount(productByVendor);

                }
            }

            if (result.Cart.ShipCode)
            var additionalChargeRules = GetAdditionalChargesJson();

            result.Cart.ShippingCharges = Convert.ToDecimal(productsByVendor.Sum(x => x.VendorTotalShippingCharges));
            //result.Cart.ShippingCharges = this.ApplyShippingDiscount(result);

            if (cartPricing.ResultCode != ResultCode.Success)
            {
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        private decimal? GetWeightBasedShippingCharges(ProductsByVendor productsByVendor)
        {
            var vendorMerchTotal = productsByVendor.OrderLines.Sum(x => x.TotalNetPrice);
            var totalVendorWeight = productsByVendor.OrderLines.Sum(x => x.Product.ShippingWeight);
            var totalPricePerLb = totalVendorWeight * ShippingChargePerPound;
            return GetFinalVendorShippingByWeight(totalPricePerLb, vendorMerchTotal);
        }

        private decimal? GetFinalVendorShippingByWeight(decimal totalPricePerLb, decimal vendorMerchTotal)
        {

            var lowestPossible = vendorMerchTotal * LowMerchPctForWeightBased;
            var highestPossible = vendorMerchTotal * HighMerchPctForWeightBased;

            var result = totalPricePerLb;
            if (totalPricePerLb < lowestPossible)
            {
                result = lowestPossible;
            }
            if (totalPricePerLb < highestPossible)
            {
                result = highestPossible;
            }
            return result;
        }

        private decimal? GetAdditionalCharges(GetCartResult result)
        {


            return 0.0m;
        }
        private decimal? GetShippingCharges(ProductsByVendor vendorLines)
        {
            decimal? lineCharges = 0.0m;
            foreach (var line in vendorLines.OrderLines)
            {
                lineCharges += line.Product.ShippingAmountOverride * line.QtyOrdered;

            }
            return lineCharges;
        }

        private decimal? ApplyShippingDiscount(ProductsByVendor result)
        {
            var shippingCharges = result.VendorTotalShippingCharges;
            if (result.VendorTotalShippingCharges >= 300.0m && result.VendorTotalShippingCharges <= 500.0m)
            {
                shippingCharges -= (result.VendorTotalShippingCharges * DiscountPct300to500);
            }
            if (result.VendorTotalShippingCharges > 500.0m && result.VendorTotalShippingCharges <= 700.0m)
            {
                shippingCharges -= (result.VendorTotalShippingCharges * DiscountPct500to700);
            }

            return shippingCharges;
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

        private List<AdditionalChargesRule> GetAdditionalChargesJson()
        {
            var jsonString = "[" +
                            "  {" +
                            "    'Type': 'F'," +
                            "    'MinWeight': 1," +
                            "    'MaxWeight': 300," +
                            "    'DeliveryCharge': 49," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': null" +
                            "  }," +
                            "  {" +
                            "    'Type': 'F'," +
                            "    'MinWeight': 301," +
                            "    'MaxWeight': 700," +
                            "    'DeliveryCharge': 79," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': null" +
                            "  }," +
                            "  {" +
                            "    'Type': 'F'," +
                            "    'MinWeight': 701," +
                            "    'MaxWeight': 900," +
                            "    'DeliveryCharge': 119," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': null" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 1," +
                            "    'MaxWeight': 499," +
                            "    'DeliveryCharge': 130," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 500," +
                            "    'MaxWeight': 699," +
                            "    'DeliveryCharge': 155," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 700," +
                            "    'MaxWeight': 899," +
                            "    'DeliveryCharge': 180," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 900," +
                            "    'MaxWeight': 1099," +
                            "    'DeliveryCharge': 205," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 1100," +
                            "    'MaxWeight': 1299," +
                            "    'DeliveryCharge': 255," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 1300," +
                            "    'MaxWeight': 1499," +
                            "    'DeliveryCharge': 280," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 1500," +
                            "    'MaxWeight': 1699," +
                            "    'DeliveryCharge': 330," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 1700," +
                            "    'MaxWeight': 1899," +
                            "    'DeliveryCharge': 355," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 1900," +
                            "    'MaxWeight': 2099," +
                            "    'DeliveryCharge': 380," +
                            "    'PoundCharge': null," +
                            "    'PricePerPound': null," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 2100," +
                            "    'MaxWeight': 2500," +
                            "    'DeliveryCharge': null," +
                            "    'PoundCharge': 100," +
                            "    'PricePerPound': 15," +
                            "    'Markup': 0.16" +
                            "  }," +
                            "  {" +
                            "    'Type': 'I'," +
                            "    'MinWeight': 2500," +
                            "    'MaxWeight': 999999," +
                            "    'DeliveryCharge': null," +
                            "    'PoundCharge': 100," +
                            "    'PricePerPound': 14," +
                            "    'Markup': 0.16" +
                            "  }" +
                            "]";

            var settings = new JsonSerializerSettings()
            {
                NullValueHandling = NullValueHandling.Ignore,
                MissingMemberHandling = MissingMemberHandling.Ignore
            };

            return JsonConvert.DeserializeObject<List<AdditionalChargesRule>>(jsonString, settings);
        }
    }
}
