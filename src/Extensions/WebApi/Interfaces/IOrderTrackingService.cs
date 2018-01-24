using Extensions.WebApi.Models;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services;
using Insite.Order.Services.Results;

namespace Extensions.WebApi.Interfaces
{
    public interface IOrderTrackingService : IDependency, IExtension
    {
        GetOrderResult GetOrder(GetTrackingOrderParameter parameter);
    }
}
