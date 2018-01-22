using Insite.Core.Interfaces.Dependency;
using Insite.Data.Entities;

namespace Extensions.WebApi.OrderTracking.Interfaces
{
    public interface IOrderTrackingService : IInterceptable, IDependency
    {
        string GetTrackedOrderId(string orderId, string phoneNumber);
        OrderHistory GetTrackedOrder(string id);
    }
}