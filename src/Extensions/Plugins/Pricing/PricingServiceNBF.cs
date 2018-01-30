// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PricingServiceGeneric.cs" company="Insite Software">
//   Copyright © 2018. Insite Software. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Extensions.Plugins.Pricing
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Insite.Core.Interfaces.Data;
    using Insite.Core.Interfaces.Dependency;
    using Insite.Core.Interfaces.Plugins.Pricing;
    using Insite.Core.Plugins.EntityUtilities;
    using Insite.Core.Plugins.Pricing;
    using Insite.Core.Plugins.Utilities;
    using Insite.Core.SystemSetting.Groups.Catalog;
    using Insite.Data.Entities;
    using Insite.Data.Entities.Dtos.Interfaces;
    using Insite.Data.Extensions;
    using Insite.Data.Repositories.Interfaces;
    using Insite.Plugins.Pricing.PriceCalculation;
    using Insite.Plugins.Pricing;

    /// <summary>The pricing service which utilizes the price matrix.</summary>
    [DependencyName(PricingServiceDependency.Generic)]
    public class PricingServiceGeneric : PricingServiceBase
    {
        /// <summary>The price matrix funcs.</summary>
        protected readonly Dictionary<string, Func<IList<PriceMatrix>, IEnumerable<PriceMatrix>>> PriceMatrixFuncs;

        /// <summary>The record type funcs.</summary>
        protected readonly Dictionary<string, Func<IList<PriceMatrix>, IEnumerable<PriceMatrix>>> RecordTypeFuncs;

        /// <summary>Initializes a new instance of the <see cref="PricingServiceGeneric"/> class.</summary>
        /// <param name="unitOfWorkFactory">The unit of work factory.</param>
        /// <param name="currencyFormatProvider">The currency format provider.</param>
        /// <param name="orderLineUtilities">The order line utilities.</param>
        /// <param name="pricingServiceFactory">The pricing service factory.</param>
        /// <param name="pricingSettings">The pricing settings.</param>
        public PricingServiceGeneric(
            IUnitOfWorkFactory unitOfWorkFactory,
            ICurrencyFormatProvider currencyFormatProvider,
            IOrderLineUtilities orderLineUtilities,
            IPricingServiceFactory pricingServiceFactory,
            PricingSettings pricingSettings)
            : base(unitOfWorkFactory, currencyFormatProvider, orderLineUtilities, pricingServiceFactory, pricingSettings)
        {
            this.RecordTypeFuncs = new Dictionary<string, Func<IList<PriceMatrix>, IEnumerable<PriceMatrix>>>();
            this.PriceMatrixFuncs = new Dictionary<string, Func<IList<PriceMatrix>, IEnumerable<PriceMatrix>>>();
        }

        /// <summary>Gets or sets the record types.</summary>
        protected List<string> RecordTypes { get; set; }

        /// <summary>Gets or sets the regular pricing.</summary>
        protected virtual PriceAndPriceBreaks ListPricing { get; set; }

        /// <summary>Calculate the price of a product.</summary>
        /// <param name="pricingServiceParameter">The <see cref="PricingServiceParameter"/> holding information for how to calculate the price</param>
        /// <returns><see cref="PricingServiceResult"/> with the calculated prices.</returns>
        public override PricingServiceResult ProcessPriceCalculation(PricingServiceParameter pricingServiceParameter)
        {
            this.SetRecordTypePriority();

            // Get all price matrix rows that we might have to deal with up front (1 sql call)
            var priceMatrixList = this.GetPriceMatrixList(pricingServiceParameter);

            // List price = pricing without customer pricing or sales
            var listPricing = this.GetPriceAndPriceBreaks(priceMatrixList, pricingServiceParameter, true);
            this.ListPricing = listPricing;

            // Regular price = special pricing for specific customers and sales
            var regularPricing = this.GetPriceAndPriceBreaks(priceMatrixList, pricingServiceParameter, false);

            this.PerformCurrencyConversion(pricingServiceParameter.CurrencyCode, listPricing);
            this.PerformCurrencyConversion(pricingServiceParameter.CurrencyCode, regularPricing);

            var pricingServiceResult = new PricingServiceResult
            {
                UnitListPrice = listPricing.Price,
                UnitListBreakPrices = listPricing.PriceBreaks,
                UnitRegularPrice = regularPricing.Price,
                UnitRegularBreakPrices = regularPricing.PriceBreaks,
                IsOnSale = regularPricing.IsSalePrice,
                CurrencyRate = listPricing.CurrencyRate
            };

            this.AddDisplayPrices(pricingServiceResult, this.GetCurrency(pricingServiceParameter.CurrencyCode));
            this.AddExtendedPrices(pricingServiceParameter, pricingServiceResult, this.GetCurrency(pricingServiceParameter.CurrencyCode));

            return pricingServiceResult;
        }

        /// <summary>The create price calculations.</summary>
        protected override void CreatePriceCalculations()
        {
            this.PriceCalculations = new List<IPriceCalculation>
            {
                new Override(),
                new Markup(),
                new Margin()
            };
        }

        /// <summary>Interleave regular price breaks with sale price breaks.</summary>
        /// <param name="unitListPricing">List pricing results</param>
        /// <param name="unitRegularPricing">Sale/Customer pricing results</param>
        /// <returns>The <see cref="List{ProductPrice}"/>.</returns>
        protected virtual List<ProductPrice> MergePriceBreaks(List<ProductPrice> unitListPricing, List<ProductPrice> unitRegularPricing)
        {
            if (unitListPricing == null || unitRegularPricing == null || unitRegularPricing.Count <= 0)
            {
                return unitRegularPricing;
            }

            var mergedPricing = new List<ProductPrice>();
            if (unitListPricing.Count > 0)
            {
                mergedPricing.AddRange(unitListPricing);
            }

            // Interleave the sale prices in with the regular prices.  Ony do this if the sale price is lower than the regular price.
            var numOfBreaks = unitRegularPricing.Count;
            for (var idx = 0; idx < numOfBreaks; idx++)
            {
                // Get the qty at which this sale price ends
                var nextQty = idx < numOfBreaks - 1 ? unitRegularPricing[idx + 1].BreakQty : decimal.MaxValue;

                // remove price breaks at all quantities for which this sale price is lower
                var breaks = mergedPricing.Where(p => p.BreakQty >= unitRegularPricing[idx].BreakQty && p.BreakQty <= nextQty).ToList();
                foreach (var br in breaks)
                {
                    if (br.Price > unitRegularPricing[idx].Price)
                    {
                        mergedPricing.Remove(br);
                    }
                }

                // Only add the sale price break if it is lower than the regular price at the quantity.
                var unitRegularPriceBreak = unitListPricing.Count <= 0 ? null : unitListPricing.OrderByDescending(p => p.BreakQty).FirstOrDefault(p => p.BreakQty <= unitRegularPricing[idx].BreakQty);
                var unitRegularPrice = unitRegularPriceBreak?.Price ?? decimal.MaxValue;
                if (unitRegularPricing[idx].Price < unitRegularPrice)
                {
                    mergedPricing.Add(unitRegularPricing[idx]);
                }
            }

            return mergedPricing.OrderBy(p => p.BreakQty).ToList();
        }

        /// <summary>Set the price based on basic pricing rules.</summary>
        protected virtual void SetBasicPricing(PriceAndPriceBreaks priceAndBreaks, PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            // UOM pricing will be handled differently so only use basiclistprice if the uom value matches the product's uom
            if (pricingServiceParameter.UnitOfMeasure == null || this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure))
            {
                var calculationFlags = this.SelectedPriceMatrix != null ? this.SelectedPriceMatrix.CalculationFlags : string.Empty;
                var price = this.GetBasePrice(pricingServiceParameter);
                price = this.ApplyProductMultiplier(pricingServiceParameter, price);
                price = this.RoundPrice(price, calculationFlags);
                priceAndBreaks.SetPrice(price, this.BaseCurrency.CurrencyCode);
            }
        }

        /// <summary>Calculate the price of a product.</summary>
        /// <param name="priceMatrixList">List of PriceMatrix records.</param>
        /// <param name="pricingServiceParameter"><see cref="PricingServiceParameter"/> values.</param>
        /// <param name="isUnitListPrice">If false, calculate special pricing.</param>
        /// <returns>The <see cref="PriceAndPriceBreaks"/>.</returns>
        protected virtual PriceAndPriceBreaks GetPriceAndPriceBreaks(IList<PriceMatrix> priceMatrixList, PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            var priceAndBreaks = new PriceAndPriceBreaks
            {
                PriceBreaks = new List<ProductPrice>(),
                IsSalePrice = false,
                IsUnitRegularPrice = !isUnitListPrice
            };

            this.SetupRecordTypeMatrixQueries(pricingServiceParameter, isUnitListPrice);
            this.SetupCommonMatrixQueries(pricingServiceParameter, isUnitListPrice);

            this.SelectedPriceMatrix = this.GetPriceMatrix(priceMatrixList, pricingServiceParameter, isUnitListPrice);

            // Iterate thru the 01-11 columns and determine which we fall into (PriceBasis, AdjustmentType, BreakQty, Amount, AltAmount)
            var priceBracketAtQty = this.GetPriceBracketByQty(this.SelectedPriceMatrix, pricingServiceParameter.QtyOrdered);

            // If we cannot make a price matrix match, price will be the basiclistprice on the product. (no price breaks included)
            if (this.SelectedPriceMatrix == null || priceBracketAtQty == null)
            {
                var defaultCurrency = this.UnitOfWork.GetTypedRepository<ICurrencyRepository>().GetCachedDefault();
                if (defaultCurrency != null && pricingServiceParameter.CurrencyCode != defaultCurrency.CurrencyCode)
                {
                    var pricingServiceParameterDefaultCurrency = new PricingServiceParameter(pricingServiceParameter) { CurrencyCode = defaultCurrency.CurrencyCode };
                    return this.GetPriceAndPriceBreaks(priceMatrixList, pricingServiceParameterDefaultCurrency, isUnitListPrice);
                }

                this.SetBasicPricing(priceAndBreaks, pricingServiceParameter, isUnitListPrice);
                priceAndBreaks.PriceBreaks = this.GetBreakPrices(this.SelectedPriceMatrix, this.GetCurrency(priceAndBreaks.CurrencyCode));
            }
            else
            {
                var priceBreaks = this.GetProductPrice(priceMatrixList, pricingServiceParameter, this.SelectedPriceMatrix, isUnitListPrice).ToList();
                priceAndBreaks.PriceBreaks.AddRange(priceBreaks);

                // Get the price at the ordered quantity
                var priceAtQty = priceAndBreaks.PriceBreaks.OrderByDescending(pb => pb.BreakQty).FirstOrDefault(b => b.BreakQty <= pricingServiceParameter.QtyOrdered);
                if (priceAtQty != null)
                {
                    priceAndBreaks.SetPrice(priceAtQty.Price, pricingServiceParameter.CurrencyCode);
                }
            }

            // if we want the regular price also check for a sale price.  The reason this is done at this point of the code is because the sale price might still be more than
            // the customer product price.  And in that case we want to use the lowest price that happens to not be the product sale price.  capisce?
            if (!isUnitListPrice)
            {
                this.SalePriceCheck(pricingServiceParameter, priceAndBreaks, priceMatrixList);
            }

            this.ZeroPriceCheck(priceAndBreaks, pricingServiceParameter, priceMatrixList);

            this.ConfigurePrice(pricingServiceParameter, priceAndBreaks);

            this.AdvancedConfigurationPrice(pricingServiceParameter, priceAndBreaks);

            if (priceAndBreaks.Price <= 0)
            {
                priceAndBreaks = this.CheckUnitOfMeasurePricing(priceMatrixList, pricingServiceParameter, priceAndBreaks, isUnitListPrice);
            }

            return priceAndBreaks;
        }

        /// <summary>The advanced configuration price.</summary>
        /// <param name="pricingServiceParameter">The pricing service parameter.</param>
        /// <param name="priceAndBreaks">The price and breaks.</param>
        protected virtual void AdvancedConfigurationPrice(PricingServiceParameter pricingServiceParameter, PriceAndPriceBreaks priceAndBreaks)
        {
            if (this.OrderLine != null && this.Product.ConfigurationObject != null)
            {
                var currencyCode = priceAndBreaks.CurrencyCode ?? pricingServiceParameter.CurrencyCode ?? this.BaseCurrency.CurrencyCode;
                var price = priceAndBreaks.Price;
                if (this.OrderLine.OrderLineConfigurationValues.Any())
                {
                    price += this.OrderLine.OrderLineConfigurationValues.Sum(m => m.PriceImpact);
                }

                priceAndBreaks.SetPrice(price, currencyCode);
            }
        }

        /// <summary>Apply a multiplier, if necessary, to a calculated price. This is an extension point for ERP systems that use a multiplier.</summary>
        /// <param name="pricingServiceParameter">A <see cref="PricingServiceParameter"/></param>
        /// <param name="price">Price that has been calculated for a product.</param>
        /// <returns>The <see cref="decimal"/>.</returns>
        protected virtual decimal ApplyProductMultiplier(PricingServiceParameter pricingServiceParameter, decimal price)
        {
            // Base calculator doesn't need to do anything.  Sx pricing will have to override this and apply a multiplier.
            return price;
        }

        /// <summary>The configure price.</summary>
        /// <param name="pricingServiceParameter">The pricing service parameter.</param>
        /// <param name="priceAndBreaks">The price and breaks.</param>
        protected virtual void ConfigurePrice(PricingServiceParameter pricingServiceParameter, PriceAndPriceBreaks priceAndBreaks)
        {
            var currencyCode = priceAndBreaks.CurrencyCode ?? pricingServiceParameter.CurrencyCode ?? this.BaseCurrency.CurrencyCode;
            priceAndBreaks.SetPrice(
                this.ConfigurePrice(priceAndBreaks.Price, pricingServiceParameter.ConfigDataSet, this.Product.IsFixedConfiguration, currencyCode, priceAndBreaks.IsUnitRegularPrice),
                currencyCode);
        }

        /// <summary>Check to see if there is any sale pricing setup for the product.</summary>
        protected virtual void SalePriceCheck(PricingServiceParameter pricingServiceParameter, PriceAndPriceBreaks priceAndBreaks, IList<PriceMatrix> priceMatrixList)
        {
            var salePriceMatrixRow = this.CombPriceMatrix("Product Sale", priceMatrixList, pricingServiceParameter, true);
            if (salePriceMatrixRow != null)
            {
                var priceBreaks = this.GetProductPrice(priceMatrixList, pricingServiceParameter, salePriceMatrixRow, false).ToList();
                var priceAtQty = priceBreaks.OrderByDescending(pb => pb.BreakQty).FirstOrDefault(b => b.BreakQty <= pricingServiceParameter.QtyOrdered);
                if (priceAtQty != null)
                {
                    var breaksPrice = priceAndBreaks.Price;
                    priceAndBreaks.SetPrice(priceAtQty.Price, pricingServiceParameter.CurrencyCode);
                    priceAndBreaks.IsSalePrice = priceAtQty.Price < breaksPrice;
                }

                priceAndBreaks.PriceBreaks = this.MergePriceBreaks(priceAndBreaks.PriceBreaks, priceBreaks);
            }
            else
            {
                var basicSalePriceInParameterCurrency = this.GetBasicSalePriceInParameterCurrency(pricingServiceParameter);

                if (pricingServiceParameter.PricingDate > this.Product.BasicSaleStartDate
                    && (this.Product.BasicSaleEndDate == null || pricingServiceParameter.PricingDate < this.Product.BasicSaleEndDate)
                    && (priceAndBreaks.Price == 0 || (priceAndBreaks.Price > 0 && priceAndBreaks.Price > basicSalePriceInParameterCurrency))
                    && this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure))
                {
                    priceAndBreaks.SetPrice(basicSalePriceInParameterCurrency, pricingServiceParameter.CurrencyCode);
                    priceAndBreaks.IsSalePrice = true;
                }
            }
        }

        /// <summary>Handle prices that have been calculated to zero.</summary>
        protected virtual void ZeroPriceCheck(PriceAndPriceBreaks priceAndBreaks, PricingServiceParameter pricingServiceParameter, IList<PriceMatrix> priceMatrixList)
        {
            if (priceAndBreaks.Price <= 0)
            {
                // We will fall back to the 'Product' matrix record if one exists. It is possible that this product pricing matrix wasn't used previously because
                // special/customer/sale pricing matrix records existed.
                var priceMatrixRow = this.CombPriceMatrix("Product", priceMatrixList, pricingServiceParameter, true);
                if (priceMatrixRow != null
                    && priceMatrixRow.Amount01 > 0
                    && priceMatrixRow.PriceBasis01.Equals("O", StringComparison.OrdinalIgnoreCase)
                    && priceMatrixRow.AdjustmentType01.Equals("A", StringComparison.OrdinalIgnoreCase))
                {
                    priceAndBreaks.SetPrice(priceMatrixRow.Amount01, pricingServiceParameter.CurrencyCode);
                }

                if (priceAndBreaks.Price <= 0
                    && (pricingServiceParameter.UnitOfMeasure.IsBlank() || this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure)))
                {
                    priceAndBreaks.SetPrice(this.GetBasePrice(pricingServiceParameter), this.BaseCurrency.CurrencyCode);
                }
            }
        }

        /// <summary>Get a price matrix record based on the priority order of RecordType values.</summary>
        /// <returns>The <see cref="PriceMatrix"/>.</returns>
        protected virtual PriceMatrix GetPriceMatrix(IList<PriceMatrix> priceMatrixList, PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            PriceMatrix priceMatrixRow = null;
            if (priceMatrixList.Count >= 0)
            {
                // get the price matrix row we are dealing with. Notice we are looping thru the list in order of precedence as dictated by the order of the values
                var recordTypes = this.RecordTypes.Where(r => !r.Equals("Product Sale", StringComparison.OrdinalIgnoreCase));
                foreach (var recordType in recordTypes)
                {
                    priceMatrixRow = this.CombPriceMatrix(recordType, priceMatrixList, pricingServiceParameter, isUnitListPrice);
                    if (priceMatrixRow != null)
                    {
                        break;
                    }
                }
            }

            return priceMatrixRow;
        }

        /// <summary>Filters that will execute on pricematrix records for every product.</summary>
        protected virtual void SetupCommonMatrixQueries(PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            // These queries will execute every time, regardless of regular/sale/customer/pricecode/etc settings
            this.PriceMatrixFuncs.Clear();
            this.PriceMatrixFuncs.Add("Currency", query => query.Where(pm => pm.CurrencyCode.Equals(pricingServiceParameter.CurrencyCode, StringComparison.OrdinalIgnoreCase)));

            this.PriceMatrixFuncs.Add("Warehouse", query => query.Where(pm => pm.Warehouse.Equals(pricingServiceParameter.Warehouse, StringComparison.OrdinalIgnoreCase)
                    || pm.Warehouse.IsBlank()));

            this.PriceMatrixFuncs.Add("Active", query => query.Where(pm => pm.ActivateOn < pricingServiceParameter.PricingDate
                    && (pm.DeactivateOn == null || pm.DeactivateOn > pricingServiceParameter.PricingDate)));
        }

        /// <summary>Create a list of PriceMatrix RecordType values in order of priority.</summary>
        protected virtual void SetRecordTypePriority()
        {
            // The order of this list defines priority of each pricematrix record type when attempting to use pricematrix records to price a product.
            this.RecordTypes = this.RecordTypesList;
        }

        /// <summary>Get a list of PriceMatrix RecordType values in order of priority.</summary>
        public virtual List<string> RecordTypesList => new List<string>
        {
            PriceMatrix.RecordTypeName.CustomerProduct,
            PriceMatrix.RecordTypeName.ParentCustomerProduct,
            PriceMatrix.RecordTypeName.CustomerProductPriceCode,
            PriceMatrix.RecordTypeName.ParentCustomerProductPriceCode,
            PriceMatrix.RecordTypeName.CustomerPriceCodeProduct,
            PriceMatrix.RecordTypeName.ParentCustomerPriceCodeProduct,
            PriceMatrix.RecordTypeName.CustomerPriceCodeProductPriceCode,
            PriceMatrix.RecordTypeName.ParentCustomerPriceCodeProductPriceCode,
            PriceMatrix.RecordTypeName.Customer,
            PriceMatrix.RecordTypeName.ParentCustomer,
            PriceMatrix.RecordTypeName.CustomerPriceCode,
            PriceMatrix.RecordTypeName.ParentCustomerPriceCode,
            PriceMatrix.RecordTypeName.Product,
            PriceMatrix.RecordTypeName.ProductPriceCode,
            PriceMatrix.RecordTypeName.ProductSale
        };

        /// <summary>Filters that will execute on pricematrix records based on the RecordType being searched for.</summary>
        protected virtual void SetupRecordTypeMatrixQueries(PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            // GOAL: allow derived classes to write/update/remove queries that execute on the in memory pricematrix list based on recordtype.
            this.RecordTypeFuncs.Clear();

            // Use the customer's pricing customer, if they have one, to gather values
            var customer = isUnitListPrice ? null : this.GetPricingCustomer();

            // default values for variables we intend to use
            var unitOfMeasure = pricingServiceParameter.UnitOfMeasure.IsBlank() ? this.Product.UnitOfMeasure.Trim() : pricingServiceParameter.UnitOfMeasure.Trim();
            var customerId = customer?.Id.ToString() ?? string.Empty;
            var customerPriceCode = customer?.PriceCode.Trim() ?? string.Empty;
            var parentCustomerId = customer?.Parent?.Id.ToString() ?? string.Empty;
            var parentCustomerPriceCode = customer?.Parent?.PriceCode.Trim() ?? string.Empty;

            // Only add a query for the record type if we want this rule to be applied.
            if (!customerId.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.CustomerProduct, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerProduct, StringComparison.OrdinalIgnoreCase)
                    && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                    && pm.CustomerKeyPart.Equals(customerId, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.Id.ToString(), StringComparison.OrdinalIgnoreCase)));
            }

            if (!parentCustomerId.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ParentCustomerProduct, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerProduct, StringComparison.OrdinalIgnoreCase)
                    && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                    && pm.CustomerKeyPart.Equals(parentCustomerId, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.Id.ToString(), StringComparison.OrdinalIgnoreCase)));
            }

            if (!customerId.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.CustomerProductPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerProductPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(customerId, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.PriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            if (!parentCustomerId.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ParentCustomerProductPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerProductPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(parentCustomerId, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.PriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            if (!customerPriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.CustomerPriceCodeProduct, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerPriceCodeProduct, StringComparison.OrdinalIgnoreCase)
                    && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                    && pm.CustomerKeyPart.Equals(customerPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.Id.ToString(), StringComparison.OrdinalIgnoreCase)));
            }

            if (!parentCustomerPriceCode.IsBlank() && customerPriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ParentCustomerPriceCodeProduct, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerPriceCodeProduct, StringComparison.OrdinalIgnoreCase)
                    && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                    && pm.CustomerKeyPart.Equals(parentCustomerPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.Id.ToString(), StringComparison.OrdinalIgnoreCase)));
            }

            if (!customerPriceCode.IsBlank() && !this.Product.PriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.CustomerPriceCodeProductPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerPriceCodeProductPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(customerPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.PriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            if (!parentCustomerPriceCode.IsBlank() && !this.Product.PriceCode.IsBlank() && customerPriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ParentCustomerPriceCodeProductPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerPriceCodeProductPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(parentCustomerPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.ProductKeyPart.Equals(this.Product.PriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            if (!customerId.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.Customer, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.Customer, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(customerId, StringComparison.OrdinalIgnoreCase)));
            }

            if (!parentCustomerId.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ParentCustomer, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.Customer, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(parentCustomerId, StringComparison.OrdinalIgnoreCase)));
            }

            if (!customerPriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.CustomerPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(customerPriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            if (!parentCustomerPriceCode.IsBlank() && customerPriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ParentCustomerPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.CustomerPriceCode, StringComparison.OrdinalIgnoreCase)
                    && pm.CustomerKeyPart.Equals(parentCustomerPriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            if (!this.Product.PriceCode.IsBlank())
            {
                this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ProductPriceCode, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.ProductPriceCode, StringComparison.OrdinalIgnoreCase)
                    && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                    && pm.ProductKeyPart.Equals(this.Product.PriceCode, StringComparison.OrdinalIgnoreCase)));
            }

            this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.Product, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.Product, StringComparison.OrdinalIgnoreCase)
                && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                && pm.CustomerKeyPart.Equals(string.Empty, StringComparison.OrdinalIgnoreCase)
                && pm.ProductKeyPart.Equals(this.Product.Id.ToString(), StringComparison.OrdinalIgnoreCase)));

            this.RecordTypeFuncs.Add(PriceMatrix.RecordTypeName.ProductSale, query => query.Where(pm => pm.RecordType.Equals(PriceMatrix.RecordTypeName.ProductSale, StringComparison.OrdinalIgnoreCase)
                && (pm.UnitOfMeasure.IsBlank() || pm.UnitOfMeasure.Equals(unitOfMeasure, StringComparison.OrdinalIgnoreCase))
                && pm.CustomerKeyPart.Equals(string.Empty, StringComparison.OrdinalIgnoreCase)
                && pm.ProductKeyPart.Equals(this.Product.Id.ToString(), StringComparison.OrdinalIgnoreCase)));
        }

        /// <summary>Find a matching pricematrix record based on a RecordType.</summary>
        /// <returns>The <see cref="PriceMatrix"/>.</returns>
        protected virtual PriceMatrix CombPriceMatrix(string recordType, IList<PriceMatrix> priceMatrixList, PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            if (recordType.IsBlank() || priceMatrixList == null || !priceMatrixList.Any() || !this.RecordTypeFuncs.ContainsKey(recordType))
            {
                return null;
            }

            // Execute the in-memory price matrix query if one has been setup for this recordtype
            var filteredMatrices = this.RecordTypeFuncs[recordType].Invoke(priceMatrixList);
            if (filteredMatrices == null || !filteredMatrices.Any())
            {
                return null;
            }

            // Execute any common queries on PriceMatrix records that may have been setup.
            if (this.PriceMatrixFuncs != null && this.PriceMatrixFuncs.Any())
            {
                foreach (var func in this.PriceMatrixFuncs.Values)
                {
                    filteredMatrices = func.Invoke(filteredMatrices.ToList());
                }
            }

            // If there are multiple matrix records found then rank them by specificity of Warehouse, UM, and currency
            // ie Prefer a pricematrix record that has a warehouse value instead of one that has a blank warehouse
            return filteredMatrices?.OrderByDescending(pm => pm.Warehouse)
                .ThenByDescending(pm => pm.UnitOfMeasure)
                .ThenByDescending(pm => pm.CurrencyCode)
                .ThenByDescending(pm => pm.ActivateOn)
                .FirstOrDefault();
        }

        /// <summary>Determine the price breaks based on the quantity of products.</summary>
        /// <param name="priceMatrix">List of PriceMatrix records.</param>
        /// <param name="qty">Search the price breaks based on this quantity</param>
        /// <returns>The <see cref="PriceBracket"/>.</returns>
        protected virtual PriceBracket GetPriceBracketByQty(PriceMatrix priceMatrix, decimal qty)
        {
            return priceMatrix == null
                ? null
                : this.GetMatrixBrackets(priceMatrix)
                    .OrderByDescending(pb => pb.BreakQty)
                    .FirstOrDefault(pb => pb.BreakQty <= qty);
        }

        /// <summary>The get break prices.</summary>
        /// <param name="priceMatrix">The price matrix.</param>
        /// <param name="currency">The currency.</param>
        /// <returns>The <see cref="List{ProductPrice}"/>.</returns>
        protected virtual List<ProductPrice> GetBreakPrices(PriceMatrix priceMatrix, ICurrency currency)
        {
            if (priceMatrix == null)
            {
                return new List<ProductPrice>();
            }

            var breaks = this.GetMatrixBrackets(priceMatrix)
                .Select(pb => new ProductPrice
                {
                    BreakQty = pb.BreakQty,
                    Price = pb.Amount,
                    PriceDisplay = this.CurrencyFormatProvider.GetString(pb.Amount, currency)
                }).ToList();

            if (priceMatrix.RecordType == "Product Sale")
            {
                breaks = this.MergePriceBreaks(this.ListPricing.PriceBreaks, breaks);
            }

            return breaks;
        }

        /// <summary>Break out the flat table structure for columns that are numbered 1 to 11.</summary>
        /// <returns>The <see cref="List{PriceBracket}"/>.</returns>
        protected virtual List<PriceBracket> GetMatrixBrackets(PriceMatrix priceMatrix)
        {
            if (priceMatrix == null)
            {
                return new List<PriceBracket>();
            }

            Func<string, int, object> getPropertyValue = (propertyPrefix, index) => priceMatrix.GetType().GetProperty(propertyPrefix + index.ToString(CultureInfo.InvariantCulture).PadLeft(2, '0')).GetValue(priceMatrix, null);
            var priceBreaks = new List<PriceBracket>();
            for (var i = 1; i <= 11; i++)
            {
                // Can't immute first break quantity to 1 for sales because sale prices may start at qty 15, for example
                var breakQty = (i == 1 && !priceMatrix.RecordType.Equals("Product Sale", StringComparison.OrdinalIgnoreCase)) ? 1M : (decimal)getPropertyValue("BreakQty", i);
                if (breakQty <= 0)
                {
                    continue;
                }

                var amount = (decimal)getPropertyValue("Amount", i);
                var altAmount = (decimal)getPropertyValue("AltAmount", i);
                var adjustmentType = (string)getPropertyValue("AdjustmentType", i);
                var priceBasis = (string)getPropertyValue("PriceBasis", i);
                priceBreaks.Add(new PriceBracket { AdjustmentType = adjustmentType, Amount = amount, AltAmount = altAmount, BreakQty = breakQty, PriceBasis = priceBasis });
            }

            return priceBreaks;
        }

        /// <summary>Calculate the initial price for a product based on PriceBasis.</summary>
        /// <returns>The <see cref="decimal"/>.</returns>
        protected virtual decimal GetTempBasisValue(string priceBasis, IList<PriceMatrix> priceMatrixList, PricingServiceParameter pricingServiceParameter, bool isUnitListPrice)
        {
            decimal tempBasisValue = 0;
            if (priceBasis.IsBlank())
            {
                return tempBasisValue;
            }

            var productPriceMatrixRow = this.CombPriceMatrix("Product", priceMatrixList, pricingServiceParameter, isUnitListPrice)
                ?? new PriceMatrix();

            switch (priceBasis)
            {
                case "C":
                case "M": // margin
                case "MU": // markup (mu/vmu)
                case "VMU":
                    tempBasisValue = this.GetProductUnitCost(this.Product, pricingServiceParameter.Warehouse);
                    break;
                case "B":
                    tempBasisValue = this.GetBasicListPriceInParameterCurrency(pricingServiceParameter);
                    break;
                case "L":
                    tempBasisValue = productPriceMatrixRow.Amount01 > 0 ? productPriceMatrixRow.Amount01 : this.GetBasicListPriceInParameterCurrency(pricingServiceParameter);
                    break;
                case "P1":
                    tempBasisValue = productPriceMatrixRow.AltAmount01;
                    break;
                case "P2":
                    tempBasisValue = productPriceMatrixRow.AltAmount02;
                    break;
                case "P3":
                    tempBasisValue = productPriceMatrixRow.AltAmount03;
                    break;
                case "P4":
                    tempBasisValue = productPriceMatrixRow.AltAmount04;
                    break;
                case "P5":
                    tempBasisValue = productPriceMatrixRow.AltAmount05;
                    break;
                case "P6":
                    tempBasisValue = productPriceMatrixRow.AltAmount06;
                    break;
            }

            return tempBasisValue;
        }

        /// <summary>Calculate the price at the requested unit of measure when the product's unit of measure doesn't match.</summary>
        /// <param name="pricingServiceParameter"><see cref="PricingServiceParameter"/> that defines requested uom and product uom.</param>
        /// <param name="price">Currently calculated price.</param>
        /// <returns>The <see cref="decimal"/>.</returns>
        protected virtual decimal AdjustForUnitOfMeasure(PricingServiceParameter pricingServiceParameter, decimal price)
        {
            if (!pricingServiceParameter.UnitOfMeasure.IsBlank() && !this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure))
            {
                var uom = this.Product.ProductUnitOfMeasures
                    .FirstOrDefault(u => u.UnitOfMeasure.Equals(pricingServiceParameter.UnitOfMeasure, StringComparison.OrdinalIgnoreCase));

                if (uom != null)
                {
                    return price * uom.QtyPerBaseUnitOfMeasure;
                }
            }

            return price;
        }

        /// <summary>Return the quantity multiplier for the unit of measure requested for pricing.</summary>
        /// <param name="pricingServiceParameter">A <see cref="PricingServiceParameter"/></param>
        /// <returns>Quantity multiplier based on the quantity requested for pricing.</returns>
        protected virtual decimal GetQtyPerBaseUnitOfMeasure(PricingServiceParameter pricingServiceParameter)
        {
            var uomQty = 1M;
            if (!pricingServiceParameter.UnitOfMeasure.IsBlank() && !this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure))
            {
                var uom = this.Product.ProductUnitOfMeasures
                    .FirstOrDefault(u => u.UnitOfMeasure.Equals(pricingServiceParameter.UnitOfMeasure, StringComparison.OrdinalIgnoreCase));

                if (uom != null && uom.QtyPerBaseUnitOfMeasure != 0M)
                {
                    uomQty = uom.QtyPerBaseUnitOfMeasure;
                }
            }

            return uomQty;
        }

        /// <summary>Check to see if this product has specific pricing based on different unit of measures.</summary>
        /// <param name="priceMatrices">List of <see cref="PriceMatrix"/> records.</param>
        /// <param name="pricingServiceParameter"><see cref="PricingServiceParameter"/></param>
        /// <param name="priceAndPriceBreaks">Prices for a product based on quantity.</param>
        /// <param name="isUnitListPrice">If true, do not price using customer and/or sale pricing.</param>
        /// <returns>The <see cref="PriceAndPriceBreaks"/>.</returns>
        protected virtual PriceAndPriceBreaks CheckUnitOfMeasurePricing(IList<PriceMatrix> priceMatrices, PricingServiceParameter pricingServiceParameter, PriceAndPriceBreaks priceAndPriceBreaks, bool isUnitListPrice)
        {
            if (!pricingServiceParameter.UnitOfMeasure.IsBlank() && !this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure))
            {
                var pricing = new PriceAndPriceBreaks();
                var originalQty = pricingServiceParameter.QtyOrdered;
                var originalUom = pricingServiceParameter.UnitOfMeasure;
                var uom = this.Product.ProductUnitOfMeasures
                    .FirstOrDefault(u => u.UnitOfMeasure.Equals(pricingServiceParameter.UnitOfMeasure, StringComparison.OrdinalIgnoreCase));

                if (uom != null)
                {
                    // Get pricing using the base uom
                    pricingServiceParameter.QtyOrdered = pricingServiceParameter.QtyOrdered * uom.QtyPerBaseUnitOfMeasure;
                    pricingServiceParameter.UnitOfMeasure = this.Product.UnitOfMeasure;
                    pricing = this.GetPriceAndPriceBreaks(priceMatrices, pricingServiceParameter, isUnitListPrice);

                    // Adjust the base price by the uom quantity
                    pricing.PriceBreaks.Clear();
                    pricing.IsSalePrice = pricing.IsSalePrice;
                    pricing.SetPrice(pricing.Price * uom.QtyPerBaseUnitOfMeasure, pricing.CurrencyCode);
                    pricingServiceParameter.QtyOrdered = originalQty;
                    pricingServiceParameter.UnitOfMeasure = originalUom;
                }
                else
                {
                    pricingServiceParameter.UnitOfMeasure = null;
                    this.SetBasicPricing(priceAndPriceBreaks, pricingServiceParameter, isUnitListPrice);
                }

                return pricing;
            }

            return priceAndPriceBreaks;
        }

        /// <summary>Determine which product values to use when filtering pricematrix records.  This can sometimes include price codes.</summary>
        /// <returns>The <see cref="List{String}"/>.</returns>
        protected virtual List<string> GetMatrixProducts(PricingServiceParameter pricingServiceParameter)
        {
            var productIds = new List<string> { this.Product.Id.ToString() };

            if (!this.Product.PriceCode.IsBlank() && !productIds.Contains(this.Product.PriceCode))
            {
                productIds.Add(this.Product.PriceCode);
            }

            return productIds;
        }

        /// <summary>Determine which customer values to use when filtering pricematrix records.  This can sometimes include price codes.</summary>
        /// <returns>The <see cref="List{String}"/>.</returns>
        protected virtual List<string> GetMatrixCustomers(PricingServiceParameter pricingServiceParameter, List<string> productIds)
        {
            var customerIds = new List<string> { string.Empty };
            var customer = this.GetPricingCustomer();
            if (customer == null)
            {
                return customerIds;
            }

            customerIds.Add(customer.Id.ToString());

            // Allow Customer to have the same price across all products per requirements
            productIds.Add(string.Empty);

            if (!customer.PriceCode.IsBlank() && !customerIds.Contains(customer.PriceCode))
            {
                customerIds.Add(customer.PriceCode);
            }

            if (customer.Parent == null)
            {
                return customerIds;
            }

            if (!customerIds.Contains(customer.Parent.Id.ToString()))
            {
                customerIds.Add(customer.Parent.Id.ToString());
            }

            if (!customer.Parent.PriceCode.IsBlank() && !customerIds.Contains(customer.Parent.PriceCode))
            {
                customerIds.Add(customer.Parent.PriceCode);
            }

            return customerIds;
        }

        /// <summary>The get pricing customer.</summary>
        /// <returns>The <see cref="Customer"/>.</returns>
        protected virtual Customer GetPricingCustomer()
        {
            return this.ShipTo?.PricingCustomer ?? this.BillTo?.PricingCustomer ?? this.ShipTo ?? this.BillTo;
        }

        /// <summary>Get a list of PriceMatrix records for a product.</summary>
        /// <param name="pricingServiceParameter"><see cref="PricingServiceParameter"/> values.</param>
        /// <returns>List of PriceMatrix objects.</returns>
        protected virtual List<PriceMatrix> GetPriceMatrixList(PricingServiceParameter pricingServiceParameter)
        {
            var productIds = this.GetMatrixProducts(pricingServiceParameter);
            var customerIds = this.GetMatrixCustomers(pricingServiceParameter, productIds);

            return this.UnitOfWork.GetRepository<PriceMatrix>().GetTable()
                .WhereContains(o => o.ProductKeyPart, productIds)
                .WhereContains(o => o.CustomerKeyPart, customerIds)
                .ToList();
        }

        protected virtual IEnumerable<ProductPrice> GetProductPrice(IList<PriceMatrix> priceMatrixList, PricingServiceParameter pricingServiceParameter, PriceMatrix selectedPriceMatrix, bool isUnitListPrice)
        {
            var result = new List<ProductPrice>();
            var matrixBrackets = this.GetMatrixBrackets(selectedPriceMatrix);
            var matrixCurrency = this.GetCurrency(selectedPriceMatrix.CurrencyCode);
            var basePrice = this.GetBasePrice(pricingServiceParameter);
            PriceData priceData;
            foreach (var bracket in matrixBrackets)
            {
                priceData = new PriceData
                {
                    PricingServiceParameter = pricingServiceParameter,
                    Product = this.Product,
                    BillTo = this.BillTo,
                    ShipTo = this.ShipTo,
                    MatrixBrackets = matrixBrackets,
                    PriceBracket = bracket,
                    BasePrice = basePrice,
                    CalculationFlags = selectedPriceMatrix.CalculationFlags,
                    TempBasis = this.GetTempBasisValue(bracket.PriceBasis, priceMatrixList, pricingServiceParameter, isUnitListPrice)
                };

                var pricingCalculation = this.PriceCalculations.FirstOrDefault(r => r.IsMatch(priceData));
                if (pricingCalculation != null)
                {
                    var productPrice = new ProductPrice
                    {
                        BreakQty = priceData.PriceBracket.BreakQty,
                        Price = pricingCalculation.CalculatePrice(priceData)
                    };
                    productPrice.Price = this.ApplyProductMultiplier(pricingServiceParameter, productPrice.Price);

                    productPrice.Price =
                        (selectedPriceMatrix.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure) ||
                            (selectedPriceMatrix.UnitOfMeasure.IsBlank() && this.Product.UnitOfMeasure.EqualsIgnoreCase(pricingServiceParameter.UnitOfMeasure))
                            || bracket.PriceBasis.Equals("CLM", StringComparison.OrdinalIgnoreCase))
                            ? productPrice.Price
                            : this.AdjustForUnitOfMeasure(pricingServiceParameter, productPrice.Price);

                    productPrice.PriceDisplay = this.CurrencyFormatProvider.GetString(productPrice.Price, matrixCurrency);
                    result.Add(productPrice);
                }
            }

            return result;
        }

        protected decimal GetBasicListPriceInParameterCurrency(PricingServiceParameter pricingServiceParameter)
        {
            return this.PerformCurrencyConversion(pricingServiceParameter.CurrencyCode, this.Product.BasicListPrice);
        }

        protected decimal GetBasicSalePriceInParameterCurrency(PricingServiceParameter pricingServiceParameter)
        {
            return this.PerformCurrencyConversion(pricingServiceParameter.CurrencyCode, this.Product.BasicSalePrice);
        }
    }
}