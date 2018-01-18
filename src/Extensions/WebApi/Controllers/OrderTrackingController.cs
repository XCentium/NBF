using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Order.Services;
using Insite.Order.Services.Parameters;
using Insite.Order.Services.Results;
using Insite.Order.WebApi.V1.ApiModels;
using Insite.Order.WebApi.V1.Mappers.Interfaces;

namespace Extensions.WebApi.Controllers
{
    [RoutePrefix("api/nbf/trackorder")]
    public class OrderTrackingController : BaseApiController
    {
        private readonly IGetOrderMapper _getOrderMapper;
        private readonly IOrderService _orderService;

        public OrderTrackingController(ICookieManager cookieManager, IOrderService orderService, IGetOrderMapper getOrderMapper)
          : base(cookieManager)
        {
            this._orderService = orderService;
            this._getOrderMapper = getOrderMapper;
        }

        [Route("", Name = "TrackOrder")]
        [ResponseType(typeof(OrderModel))]
        public async Task<IHttpActionResult> Get(string orderId, string phoneNumber)
        {
            var something = await ExecuteAsync<IGetOrderMapper, string, GetOrderParameter, GetOrderResult, OrderModel>(_getOrderMapper, this._orderService.GetOrder, orderId);
            return something;
        }
    }
}
