using Extensions.WebApi.OrderTracking.Interfaces;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Order.Services.Results;

namespace Extensions.WebApi.OrderTracking.Services
{
    public class OrderTrackingService : ServiceBase, IOrderTrackingService
    {
        private readonly IHandlerFactory _handlerFactory;

        public OrderTrackingService(IUnitOfWorkFactory unitOfWorkFactory, IHandlerFactory handlerFactory) : base(unitOfWorkFactory)
        {
            _handlerFactory = handlerFactory;
        }

        [Transaction]
        public GetOrderResult GetOrder(GetTrackingOrderParameter parameter)
        {
            return this._handlerFactory.GetHandler<IHandler<GetTrackingOrderParameter, GetOrderResult>>().Execute(this.UnitOfWork, parameter, new GetOrderResult());
        }
    }
}
