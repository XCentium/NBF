using System;
using System.Linq;
using Extensions.Handlers.Interfaces;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.Data.Extensions;
using Insite.Order.Services.Results;

namespace Extensions.Handlers
{
    [DependencyName("GetTrackedOrderHandler")]
    public class GetTrackedOrderHandler : HandlerBase<GetTrackingOrderParameter, GetOrderResult>
    {
        protected readonly Lazy<INbfGetOrderHelper> GetOrderHelper;

        public override int Order
        {
            get
            {
                return 500;
            }
        }

        public GetTrackedOrderHandler(Lazy<INbfGetOrderHelper> getOrderHelper)
        {
            this.GetOrderHelper = getOrderHelper;
        }
        public override GetOrderResult Execute(IUnitOfWork unitOfWork, GetTrackingOrderParameter parameter, GetOrderResult result)
        {
            this.GetOrderHelper.Value.PopulateGetOrderResult(this.GetOrderHistory(unitOfWork, SiteContext.Current.BillTo, parameter), parameter, result, unitOfWork);
        
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        protected virtual OrderHistory GetOrderHistory(IUnitOfWork unitOfWork, Customer customer, GetTrackingOrderParameter parameter)
        {
            return (from o in unitOfWork.GetRepository<OrderHistory>().GetTable().Expand((OrderHistory x) => x.OrderHistoryLines).Expand((OrderHistory x) => x.OrderHistoryPromotions)
                where o.Id.ToString().Equals(parameter.OrderId, StringComparison.OrdinalIgnoreCase)
                select o).FirstOrDefault();
        }
    }
}