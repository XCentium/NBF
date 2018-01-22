using System;
using System.Linq;
using Extensions.WebApi.OrderTracking.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Data.Entities;

namespace Extensions.WebApi.OrderTracking.Services
{
    public class OrderTrackingService : ServiceBase, IOrderTrackingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderTrackingService(IUnitOfWorkFactory unitOfWorkFactory) : base (unitOfWorkFactory)
        {
            this._unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public OrderHistory GetTrackedOrder(string id)
        {
            var order = _unitOfWork.GetRepository<OrderHistory>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.Id.ToString().EqualsIgnoreCase(id));

            if (order == null)
            {
                throw new Exception("Order not Found");
            }

            return order;
        }

        public string GetTrackedOrderId(string orderId, string phoneNumber)
        {
            var order = _unitOfWork.GetRepository<OrderHistory>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.ErpOrderNumber.EqualsIgnoreCase(orderId) || x.WebOrderNumber.EqualsIgnoreCase(orderId));

            if (order == null)
            {
                throw new Exception("Order not Found");
            }

            var matchedPhone = _unitOfWork.GetRepository<Customer>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.CustomerNumber.Equals(order.CustomerNumber) && x.Phone.Equals(phoneNumber));

            if (matchedPhone == null)
            {
                throw new Exception("Order not Found");
            }

            return order.Id.ToString();
        }
    }
}