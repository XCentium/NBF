using Extensions.Models.ShippingChargesRule;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.Utility.Shipping
{
    public static class ShippingHelper
    {
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

        public static List<ShippingByVendor> CalculateShippingByVendor(List<ShippingChargesRuleModel> additionalCharges, CustomerOrder cart)
        {
            var productsByVendor = GroupProductsByVendor(cart);

            foreach (var productByVendor in productsByVendor)
            {
                var vendorMerchTotal = productByVendor.OrderLines.Sum(x => x.TotalNetPrice);
                productByVendor.IsTruck = (productByVendor.OrderLines.Where(x => x.QtyOrdered >= Convert.ToDecimal(x.Product.QtyPerShippingPackage)).FirstOrDefault() != null);

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
                    if (cart.ShippingCharges > 0)
                    {
                        productByVendor.VendorTotalShippingCharges = ApplyShippingDiscount(productByVendor);
                        GetWeightBasedShippingCharges(productByVendor);
                    }
                }

                if (!productByVendor.IsTruck)
                {
                    productByVendor.IsTruck = (productByVendor.OrderLines.Where(x => x.QtyOrdered >= Convert.ToDecimal(x.Product.QtyPerShippingPackage)).FirstOrDefault() != null);
                }

                if (productByVendor.IsTruck)
                {
                    productByVendor.VendorTotalShippingCharges = GetShippingCharges(productByVendor);
                    productByVendor.VendorTotalShippingCharges = ApplyShippingDiscount(productByVendor);
                }

                if (cart.ShipVia != null && !string.IsNullOrEmpty(cart.ShipVia.ShipCode) && cart.ShipVia.ShipCode.ToLower() != "standard")
                {
                    productByVendor.VendorTotalShippingCharges += ApplyAdditionalCharges(productByVendor, cart, additionalCharges);
                }

            }

            return productsByVendor.Select(pbv => 
                    new ShippingByVendor() {
                        ShippingCost = pbv.VendorTotalShippingCharges ?? 0,
                        VendorId = pbv.VendorId.Value,
                        ShipCode = cart.ShipVia?.ShipCode?.Substring(0, 1).ToUpper(),
                        OrderLines = pbv.OrderLines
                    }
                ).ToList();
        }

        private static decimal? ApplyAdditionalCharges(ProductsByVendor productsByVendor, CustomerOrder cart, List<ShippingChargesRuleModel> additionalChargesList)
        {
            decimal? additionalCharge = 0.0m;
            if (productsByVendor.IsTruck)
            {

                //var additionalChargesList = GetAdditionalChargesJson();

                var totalVendorWeight = productsByVendor.OrderLines.Sum(x => x.Product.ShippingWeight * x.QtyOrdered);
                if (cart.ShipVia.ShipCode.ToLower() == "i")  // handle inside/front door delivery
                {
                    if (cart.OrderLines.Where(x => x.Product.ShippingWeight >= 125).FirstOrDefault() != null || totalVendorWeight >= 900)
                    {
                        cart.ShipVia.ShipCode = "I";
                    }
                    else
                    {
                        cart.ShipVia.ShipCode = "F";
                    }
                }

                var currentService = additionalChargesList.Where(x => x.Type.ToLower() == cart.ShipVia.ShipCode.ToLower() && totalVendorWeight > x.MinWeight && totalVendorWeight < x.MaxWeight).FirstOrDefault();

                if (currentService != null)
                {
                    if (currentService.PoundCharge != null)
                    {
                        additionalCharge = (totalVendorWeight / currentService.PoundCharge) * currentService.PricePerPound;
                    }
                    else
                    {
                        additionalCharge = currentService.DeliveryCharge;
                    }
                    if (currentService.Markup != null)
                    {
                        additionalCharge += additionalCharge * currentService.Markup;
                    }
                }
            }


            return additionalCharge;
        }

        private static decimal? GetWeightBasedShippingCharges(ProductsByVendor productsByVendor)
        {
            var vendorMerchTotal = productsByVendor.OrderLines.Sum(x => x.TotalNetPrice);
            var totalVendorWeight = productsByVendor.OrderLines.Sum(x => x.Product.ShippingWeight * x.QtyOrdered);
            var totalPricePerLb = totalVendorWeight * ShippingChargePerPound;
            return GetFinalVendorShippingByWeight(totalPricePerLb, vendorMerchTotal);
        }

        private static decimal? GetFinalVendorShippingByWeight(decimal totalPricePerLb, decimal vendorMerchTotal)
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

        private static decimal? GetShippingCharges(ProductsByVendor vendorLines)
        {
            decimal? lineCharges = 0.0m;
            foreach (var line in vendorLines.OrderLines)
            {
                lineCharges += line.Product.ShippingAmountOverride * line.QtyOrdered;

            }
            return lineCharges;
        }

        private static decimal? ApplyShippingDiscount(ProductsByVendor result)
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

        public static List<ProductsByVendor> GroupProductsByVendor(CustomerOrder cart)
        {
            var productsByVendor = new List<ProductsByVendor>();
            foreach (var line in cart.OrderLines)
            {
                if (line.Product.Vendor != null)
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
            }
            return productsByVendor;
        }
    }

    public class ShippingByVendor
    {
        public decimal ShippingCost { get; set; }
        public Guid VendorId { get; set; }
        public string ShipCode { get; set; }
        public List<OrderLine> OrderLines { get; set; }
    }

    public class ProductsByVendor
    {
        public Guid? VendorId { get; set; }
        public List<OrderLine> OrderLines { get; set; }
        public bool IsTruck { get; set; }
        public decimal? VendorTotalShippingCharges { get; set; }
    }
}