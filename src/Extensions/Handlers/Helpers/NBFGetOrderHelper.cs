using Insite.Catalog.Services;
using Insite.Catalog.Services.Dtos;
using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Data.Entities;
using Insite.Order.Services.Dtos;
using Insite.Order.Services.Parameters;
using Insite.Order.Services.Results;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using Extensions.Handlers.Interfaces;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Core.Localization;
using Insite.Order.Services;

namespace Extensions.Handlers.Helpers
{
    public class NbfGetOrderHelper : INbfGetOrderHelper, IDependency
    {
        protected readonly Lazy<IProductService> ProductService;
        protected readonly Lazy<IShipmentService> ShipmentService;
        protected readonly Lazy<IEntityTranslationService> EntityTranslationService;

        public NbfGetOrderHelper(Lazy<IProductService> productService, Lazy<IShipmentService> shipmentService, Lazy<IEntityTranslationService> entityTranslationService)
        {
            this.ProductService = productService;
            this.ShipmentService = shipmentService;
            this.EntityTranslationService = entityTranslationService;
        }

        public virtual GetOrderResult PopulateGetOrderResult(OrderHistory orderHistory, GetTrackingOrderParameter parameter, GetOrderResult result, IUnitOfWork unitOfWork)
        {
            if (orderHistory == null)
                return this.CreateErrorServiceResult<GetOrderResult>(result, SubCode.NotFound, string.Format(MessageProvider.Current.Not_Found, (object)"OrderHistory"));
            result.OrderHistory = orderHistory;
            result.MicroSite = SiteContext.Current.Microsite;
            result.ReturnReasons = (ICollection<string>)((IEnumerable<SystemListValue>)unitOfWork.GetRepository<SystemList>().GetTable().Where<SystemList>((Expression<Func<SystemList, bool>>)(o => o.Name == "RmaReasonCode")).SelectMany<SystemList, SystemListValue>((Expression<Func<SystemList, IEnumerable<SystemListValue>>>)(x => x.Values)).OrderBy<SystemListValue, string>((Expression<Func<SystemListValue, string>>)(o => o.Name)).ToArray<SystemListValue>()).Select<SystemListValue, string>((Func<SystemListValue, string>)(o => this.EntityTranslationService.Value.TranslateProperty<SystemListValue>(o, (Expression<Func<SystemListValue, string>>)(p => p.Description)))).ToList<string>();
            if (parameter.GetOrderLines)
            {
                foreach (KeyValuePair<OrderHistoryLine, ProductDto> productDto in this.GetProductDtos(orderHistory.OrderHistoryLines))
                {
                    KeyValuePair<OrderHistoryLine, ProductDto> entry = productDto;
                    GetOrderLineResult getOrderLineResult = new GetOrderLineResult() { OrderHistoryLine = entry.Key, ProductDto = entry.Value };
                    DataSet configDataSet = this.GetConfigDataSet(entry.Key);
                    if (entry.Value != null && entry.Value.IsConfigured && (configDataSet != null && configDataSet.Tables.Contains("SectionOption")))
                        getOrderLineResult.SectionOptions = (ICollection<SectionOptionDto>)configDataSet.Tables["SectionOption"].Rows.Cast<DataRow>().Where<DataRow>((Func<DataRow, bool>)(row =>
                        {
                            if (!entry.Value.IsFixedConfiguration)
                                return Convert.ToBoolean(row["Selected"] == DBNull.Value ? (object)false : row["Selected"]);
                            return true;
                        })).OrderBy<DataRow, int>((Func<DataRow, int>)(row => Convert.ToInt32(row["SortOrder"] == DBNull.Value ? (object)0 : row["SortOrder"]))).Select<DataRow, SectionOptionDto>((Func<DataRow, SectionOptionDto>)(row => new SectionOptionDto(new Guid(row["SectionOptionId"].ToString()), row["SectionName"].ToString(), row["Description"].ToString()))).ToList<SectionOptionDto>();
                    result.GetOrderLineResults.Add(getOrderLineResult);
                }
                result.CanAddToCart = result.GetOrderLineResults.Any<GetOrderLineResult>((Func<GetOrderLineResult, bool>)(x =>
                {
                    if (x.ProductDto != null)
                        return x.ProductDto.CanAddToCart;
                    return false;
                }));
                result.CanAddAllToCart = !result.GetOrderLineResults.Any<GetOrderLineResult>((Func<GetOrderLineResult, bool>)(x =>
                {
                    if (x.ProductDto != null)
                        return !x.ProductDto.CanAddToCart;
                    return false;
                }));
                result.ShowTaxAndShipping = true;
            }
            if (parameter.GetShipments)
            {
                GetShipmentCollectionResult shipmentCollection = this.ShipmentService.Value.GetShipmentCollection(new GetShipmentCollectionParameter() { ErpOrderNumber = orderHistory.ErpOrderNumber, WebOrderNumber = orderHistory.WebOrderNumber });
                if (shipmentCollection.ResultCode != ResultCode.Success)
                    return this.CreateErrorServiceResult<GetOrderResult>(result, shipmentCollection.SubCode, shipmentCollection.Message);
                //shipmentCollection.Shipments = result.Shipments;
            }
            result.Currency = unitOfWork.GetRepository<Insite.Data.Entities.Currency>().GetTable().FirstOrDefault<Insite.Data.Entities.Currency>((Expression<Func<Insite.Data.Entities.Currency, bool>>)(x => x.CurrencyCode == result.OrderHistory.CurrencyCode));
            result.OrderStatusMapping = unitOfWork.GetRepository<OrderStatusMapping>().GetTable().FirstOrDefault<OrderStatusMapping>((Expression<Func<OrderStatusMapping, bool>>)(x => x.ErpOrderStatus == result.OrderHistory.Status));
            return result;
        }

        public virtual Dictionary<OrderHistoryLine, ProductDto> GetProductDtos(ICollection<OrderHistoryLine> orderHistoryLines)
        {
            Dictionary<OrderHistoryLine, ProductDto> dictionary = new Dictionary<OrderHistoryLine, ProductDto>();
            IProductService productService = this.ProductService.Value;
            GetProductCollectionParameter parameter = new GetProductCollectionParameter();
            parameter.ErpNumbers = (ICollection<string>)orderHistoryLines.Where<OrderHistoryLine>((Func<OrderHistoryLine, bool>)(x => !x.ProductErpNumber.IsBlank())).Select<OrderHistoryLine, string>((Func<OrderHistoryLine, string>)(x => x.ProductErpNumber)).ToList<string>();
            int num = 0;
            parameter.GetPrices = num != 0;
            GetProductCollectionResult productCollection = productService.GetProductCollection(parameter);
            foreach (OrderHistoryLine orderHistoryLine in (IEnumerable<OrderHistoryLine>)orderHistoryLines)
            {
                OrderHistoryLine line = orderHistoryLine;
                if (productCollection.ResultCode != ResultCode.Success || productCollection.ProductDtos == null)
                {
                    dictionary.Add(line, (ProductDto)null);
                }
                else
                {
                    ProductDto productDto = productCollection.ProductDtos.FirstOrDefault<ProductDto>((Func<ProductDto, bool>)(x => x.ERPNumber.SafeTrim().EqualsIgnoreCase(line.ProductErpNumber.SafeTrim())));
                    dictionary.Add(line, productDto);
                }
            }
            return dictionary;
        }

        public virtual DataSet GetConfigDataSet(OrderHistoryLine orderLine)
        {
            DataSet dataSet = new DataSet("ConfigDataSet");
            string s = orderLine.ConfigDataSet.Trim();
            if (s.Length > 0)
            {
                int num = (int)dataSet.ReadXml((TextReader)new StringReader(s));
            }
            return dataSet;
        }

        protected virtual T CreateErrorServiceResult<T>(T result, SubCode subCode, string message = null) where T : ResultBase
        {
            return this.CreateServiceResult<T>(result, ResultCode.Error, subCode, message);
        }

        protected virtual T CreateServiceResult<T>(T result, ResultCode resultCode, SubCode subCode, string message = null) where T : ResultBase
        {
            result.ResultCode = resultCode;
            result.SubCode = subCode;
            if (message != null && result.Messages.All<ResultMessage>((Func<ResultMessage, bool>)(m => !m.Message.EqualsIgnoreCase(message))))
                result.Messages.Add(new ResultMessage()
                {
                    Message = message
                });
            return result;
        }
    }
}
