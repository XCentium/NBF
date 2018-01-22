using System;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.OrderTracking.Interfaces;
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
        private readonly IOrderTrackingService _orderTrackingService;

        public OrderTrackingController(ICookieManager cookieManager, IOrderService orderService, IGetOrderMapper getOrderMapper, IOrderTrackingService orderTrackingService)
          : base(cookieManager)
        {
            _orderService = orderService;
            _getOrderMapper = getOrderMapper;
            _orderTrackingService = orderTrackingService;
        }

        [Route("", Name = "TrackOrder")]
        [ResponseType(typeof(string))]
        public string Get(string orderId, string phoneNumber)
        {
            return _orderTrackingService.GetTrackedOrderId(orderId, phoneNumber);
        }

        //[Route("Details", Name = "TrackOrderDetails")]
        //[ResponseType(typeof(OrderHistory))]
        //public async Task<IHttpActionResult> Get(string id)
        //{
        //    var order = _orderTrackingService.GetTrackedOrder(id);

        //    if (order == null)
        //        throw new Exception("Order not found");

        //    return await ExecuteAsync<IGetOrderMapper, string, GetOrderParameter, GetOrderResult, OrderModel>(_getOrderMapper, _orderService.GetOrder, order.ErpOrderNumber);
        //}
    }
}
