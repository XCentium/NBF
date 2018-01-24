using Extensions.WebApi.OrderTracking.Models;
using Insite.Core.Interfaces.Dependency;
using Insite.Order.Services.Results;

namespace Extensions.WebApi.OrderTracking.Interfaces
{
    public interface IOrderTrackingService : IDependency, IExtension
    {
        GetOrderResult GetOrder(GetTrackingOrderParameter parameter);
    }
}
