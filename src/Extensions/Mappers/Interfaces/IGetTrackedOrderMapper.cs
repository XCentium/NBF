using Extensions.WebApi.OrderTracking.Models;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.WebApi.Interfaces;
using Insite.Order.Services.Results;
using Insite.Order.WebApi.V1.ApiModels;

namespace Extensions.Mappers.Interfaces
{
    public interface IGetTrackedOrderMapper : IWebApiMapper<string, GetTrackingOrderParameter, GetOrderResult, OrderModel>, IDependency
    {
    }
}
