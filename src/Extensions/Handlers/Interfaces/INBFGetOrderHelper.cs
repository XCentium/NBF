using System.Collections.Generic;
using System.Data;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Catalog.Services.Dtos;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Data.Entities;
using Insite.Order.Services.Results;

namespace Extensions.Handlers.Interfaces
{
    public interface INbfGetOrderHelper : IDependency, IExtension
    {
        GetOrderResult PopulateGetOrderResult(OrderHistory orderHistory, GetTrackingOrderParameter parameter, GetOrderResult result, IUnitOfWork unitOfWork);

        Dictionary<OrderHistoryLine, ProductDto> GetProductDtos(ICollection<OrderHistoryLine> orderHistoryLines);

        DataSet GetConfigDataSet(OrderHistoryLine orderLine);
    }
}
