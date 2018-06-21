using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Extensions.Mappers.Interfaces;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Catalog.Services.Dtos;
using Insite.Common.Helpers;
using Insite.Core.Extensions;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi.Interfaces;
using Insite.Data.Entities;
using Insite.Order.Services.Dtos;
using Insite.Order.Services.Results;
using Insite.Order.WebApi.V1.ApiModels;

namespace Extensions.Mappers
{
    public class GetTrackedOrderMapper : IGetTrackedOrderMapper
    {
        protected readonly ICurrencyFormatProvider CurrencyFormatProvider;
        protected readonly IObjectToObjectMapper ObjectToObjectMapper;
        protected readonly IUrlHelper UrlHelper;
        protected readonly ITranslationLocalizer TranslationLocalizer;

        public GetTrackedOrderMapper(ICurrencyFormatProvider currencyFormatProvider, IUrlHelper urlHelper, IObjectToObjectMapper objectToObjectMapper, ITranslationLocalizer translationLocalizer)
        {
            CurrencyFormatProvider = currencyFormatProvider;
            UrlHelper = urlHelper;
            ObjectToObjectMapper = objectToObjectMapper;
            TranslationLocalizer = translationLocalizer;
        }

        public virtual GetTrackingOrderParameter MapParameter(string orderId, HttpRequestMessage request)
        {
            if (orderId.IsBlank())
                throw new ArgumentNullException("orderNumber");
            string source = request.GetQueryString("expand") ?? string.Empty;
            GetTrackingOrderParameter getOrderParameter = new GetTrackingOrderParameter(orderId);
            int num1 = source.ContainsCaseInsensitive("orderlines") ? 1 : 0;
            getOrderParameter.GetOrderLines = num1 != 0;
            int num2 = source.ContainsCaseInsensitive("shipments") ? 1 : 0;
            getOrderParameter.GetShipments = num2 != 0;
            return getOrderParameter;
        }

        public virtual OrderModel MapResult(GetOrderResult serviceResult, HttpRequestMessage request)
        {
            if (serviceResult == null)
                throw new ArgumentNullException("serviceResult");
            OrderModel orderModel1 = ObjectToObjectMapper.Map<OrderHistory, OrderModel>(serviceResult.OrderHistory);
            orderModel1.CanAddToCart = serviceResult.CanAddToCart;
            orderModel1.CanAddAllToCart = serviceResult.CanAddAllToCart;
            orderModel1.Properties = serviceResult.Properties;
            Currency currency = serviceResult.Currency;
            orderModel1.CurrencySymbol = currency?.CurrencySymbol;
            orderModel1.OrderDiscountAmountDisplay = CurrencyFormatProvider.GetString(orderModel1.OrderDiscountAmount, currency);
            orderModel1.ProductDiscountAmountDisplay = CurrencyFormatProvider.GetString(orderModel1.ProductDiscountAmount, currency);
            orderModel1.OrderGrandTotalDisplay = CurrencyFormatProvider.GetString(orderModel1.OrderTotal, currency);
            orderModel1.OrderSubTotal = orderModel1.ProductTotal - orderModel1.ProductDiscountAmount;
            orderModel1.OrderSubTotalDisplay = CurrencyFormatProvider.GetString(orderModel1.OrderSubTotal, currency);
            orderModel1.OtherChargesDisplay = CurrencyFormatProvider.GetString(orderModel1.OtherCharges, currency);
            orderModel1.ProductTotalDisplay = CurrencyFormatProvider.GetString(orderModel1.ProductTotal, currency);
            orderModel1.ShippingChargesDisplay = CurrencyFormatProvider.GetString(orderModel1.ShippingCharges, currency);
            orderModel1.HandlingChargesDisplay = CurrencyFormatProvider.GetString(orderModel1.HandlingCharges, currency);
            orderModel1.ShippingAndHandlingDisplay = CurrencyFormatProvider.GetString(orderModel1.ShippingCharges + orderModel1.HandlingCharges, currency);
            orderModel1.TotalTaxDisplay = CurrencyFormatProvider.GetString(orderModel1.TaxAmount, currency);
            orderModel1.ShowTaxAndShipping = serviceResult.ShowTaxAndShipping;
            OrderModel orderModel2 = orderModel1;
            DateTimeOffset? requestedDeliveryDate = serviceResult.OrderHistory.RequestedDeliveryDate;
            // ISSUE: explicit reference operation
            // ISSUE: variable of a reference type
            var local = @requestedDeliveryDate;
            // ISSUE: explicit reference operation
            // ISSUE: explicit reference operation
            DateTime? nullable = local.HasValue ? local.GetValueOrDefault().Date : new DateTime?();
            orderModel2.RequestedDeliveryDateDisplay = nullable;
            orderModel1.StatusDisplay = serviceResult.OrderStatusMapping == null ? TranslationLocalizer.TranslateLabel(orderModel1.Status) : ObjectToObjectMapper.Map<OrderStatusMapping, OrderStatusMappingModel>(serviceResult.OrderStatusMapping).DisplayName;
            string str1 = orderModel1.WebOrderNumber.IsBlank() ? orderModel1.ErpOrderNumber : orderModel1.WebOrderNumber;
            orderModel1.Uri = request == null ? string.Empty : UrlHelper.Link("OrderV1", new { orderId = str1 }, request);
            foreach (GetOrderLineResult getOrderLineResult in serviceResult.GetOrderLineResults)
            {
                OrderLineModel orderLineModel = new OrderLineModel();
                if (getOrderLineResult.ProductDto != null)
                {
                    ObjectToObjectMapper.Map(getOrderLineResult.ProductDto, orderLineModel);
                    orderLineModel.ProductUri = getOrderLineResult.ProductDto.ProductDetailUrl;
                    orderLineModel.IsActiveProduct = getOrderLineResult.ProductDto.IsActive;
                }
                ObjectToObjectMapper.Map(getOrderLineResult.OrderHistoryLine, orderLineModel);
                orderLineModel.UnitOfMeasureDisplay = null;
                orderLineModel.UnitOfMeasureDescription = null;
                ProductDto productDto = getOrderLineResult.ProductDto;
                ProductUnitOfMeasureDto unitOfMeasureDto1;
                if (productDto == null)
                {
                    unitOfMeasureDto1 = null;
                }
                else
                {
                    List<ProductUnitOfMeasureDto> productUnitOfMeasures = productDto.ProductUnitOfMeasures;
                    if (productUnitOfMeasures == null)
                    {
                        unitOfMeasureDto1 = null;
                    }
                    else
                    {
                        Func<ProductUnitOfMeasureDto, bool> predicate = x => x.UnitOfMeasure == orderLineModel.UnitOfMeasure;
                        unitOfMeasureDto1 = productUnitOfMeasures.FirstOrDefault(predicate);
                    }
                }
                ProductUnitOfMeasureDto unitOfMeasureDto2 = unitOfMeasureDto1;
                if (unitOfMeasureDto2 != null)
                {
                    orderLineModel.UnitOfMeasureDisplay = unitOfMeasureDto2.UnitOfMeasureDisplay;
                    orderLineModel.UnitOfMeasureDescription = unitOfMeasureDto2.Description;
                }
                orderLineModel.SectionOptions = getOrderLineResult.SectionOptions;
                orderLineModel.TotalRegularPriceDisplay = CurrencyFormatProvider.GetString(orderLineModel.TotalRegularPrice, currency);
                orderLineModel.UnitDiscountAmountDisplay = CurrencyFormatProvider.GetString(orderLineModel.UnitDiscountAmount, currency);
                orderLineModel.TotalDiscountAmountDisplay = CurrencyFormatProvider.GetString(orderLineModel.TotalDiscountAmount, currency);
                orderLineModel.ExtendedUnitNetPrice = NumberHelper.RoundCurrency(orderLineModel.UnitNetPrice * orderLineModel.QtyOrdered);
                orderLineModel.ExtendedUnitNetPriceDisplay = CurrencyFormatProvider.GetString(orderLineModel.ExtendedUnitNetPrice, currency);
                orderLineModel.UnitNetPriceDisplay = CurrencyFormatProvider.GetString(orderLineModel.UnitNetPrice, currency);
                orderLineModel.UnitListPriceDisplay = CurrencyFormatProvider.GetString(orderLineModel.UnitListPrice, currency);
                orderLineModel.UnitRegularPriceDisplay = CurrencyFormatProvider.GetString(orderLineModel.UnitRegularPrice, currency);
                orderLineModel.UnitCostDisplay = CurrencyFormatProvider.GetString(orderLineModel.UnitCost, currency);
                orderLineModel.OrderLineOtherChargesDisplay = CurrencyFormatProvider.GetString(orderLineModel.OrderLineOtherCharges, currency);
                orderModel1.OrderLines.Add(orderLineModel);
            }
            foreach (OrderHistoryPromotion historyPromotion in serviceResult.OrderHistory.OrderHistoryPromotions)
            {
                OrderPromotionModel orderPromotionModel1 = new OrderPromotionModel();
                orderPromotionModel1.Id = historyPromotion.Id.ToString();
                orderPromotionModel1.Name = historyPromotion.Name;
                orderPromotionModel1.Amount = historyPromotion.Amount;
                orderPromotionModel1.AmountDisplay = CurrencyFormatProvider.GetString(historyPromotion.Amount ?? Decimal.Zero, currency);
                orderPromotionModel1.OrderHistoryLineId = historyPromotion.OrderHistoryLineId;
                PromotionResult promotionResult = historyPromotion.Promotion.PromotionResults.FirstOrDefault();
                string str2 = promotionResult != null ? promotionResult.PromotionResultType : null;
                orderPromotionModel1.PromotionResultType = str2;
                OrderPromotionModel orderPromotionModel2 = orderPromotionModel1;
                orderModel1.OrderPromotions.Add(orderPromotionModel2);
            }
            if (serviceResult.Shipments != null)
                orderModel1.ShipmentPackages = serviceResult.Shipments.SelectMany(s => (IEnumerable<ShipmentPackageDto>)s.ShipmentPackages).OrderByDescending(s => s.ShipmentDate).ToList();
            if (serviceResult.ReturnReasons != null)
                orderModel1.ReturnReasons = serviceResult.ReturnReasons;
            foreach (OrderHistoryTaxDto orderHistoryTax in orderModel1.OrderHistoryTaxes)
            {
                orderHistoryTax.TaxCode = TranslationLocalizer.TranslateLabel(orderHistoryTax.TaxCode);
                orderHistoryTax.TaxDescription = TranslationLocalizer.TranslateLabel(orderHistoryTax.TaxDescription);
                orderHistoryTax.TaxAmountDisplay = CurrencyFormatProvider.GetString(orderHistoryTax.TaxAmount, currency);
            }
            return orderModel1;
        }
    }
}