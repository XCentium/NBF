using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;
using Insite.Order.Services;
using Insite.Order.Services.Parameters;
using Insite.Order.Services.Results;
using Insite.Order.WebApi.V1.ApiModels;
using Insite.Order.WebApi.V1.Mappers.Interfaces;

namespace Extensions.WebApi.OrderTracking.Controllers
{
    [RoutePrefix("api/nbf/trackorder")]
    public class OrderTrackingController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IGetOrderMapper _getOrderMapper;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;

        public OrderTrackingController(ICookieManager cookieManager, IOrderService orderService, IGetOrderMapper getOrderMapper, IUnitOfWorkFactory unitOfWorkFactory)
          : base(cookieManager)
        {
            _orderService = orderService;
            _getOrderMapper = getOrderMapper;
            _unitOfWorkFactory = unitOfWorkFactory;

        }

        [Route("", Name = "TrackOrder")]
        [ResponseType(typeof(string))]
        public string Get(string orderId, string phoneNumber)
        {
            var unitOfWork = _unitOfWorkFactory.GetUnitOfWork();
            var order = unitOfWork.GetRepository<OrderHistory>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.ErpOrderNumber.Equals(orderId, StringComparison.CurrentCultureIgnoreCase) || x.WebOrderNumber.Equals(orderId, StringComparison.CurrentCultureIgnoreCase));

            if (order == null)
            {
                return null;
            }

            var matchedPhone = unitOfWork.GetRepository<Customer>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.CustomerNumber.Equals(order.CustomerNumber) && (x.Phone.Equals(phoneNumber) || x.Phone.Equals(phoneNumber.Replace("-",""))));

            if (matchedPhone == null)
            {
                return null;
            }

            return order.Id.ToString();
        }

        [Route("Details", Name = "TrackOrderDetails")]
        [ResponseType(typeof(OrderHistory))]
        public OrderHistory Get(string orderId)
        {
            var unitOfWork = _unitOfWorkFactory.GetUnitOfWork();
            var order = unitOfWork.GetRepository<OrderHistory>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.Id.ToString().Equals(orderId, StringComparison.CurrentCultureIgnoreCase));

            if (order == null)
            {
                return null;
            }

            return order;

            //return await ExecuteAsync<IGetOrderMapper, string, GetOrderParameter, GetOrderResult, OrderModel>(_getOrderMapper, _orderService.GetOrder, order.WebOrderNumber);
        }
    }
}
