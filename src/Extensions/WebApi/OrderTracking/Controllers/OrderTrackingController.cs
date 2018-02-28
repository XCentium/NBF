using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.Mappers.Interfaces;
using Extensions.WebApi.OrderTracking.Interfaces;
using Extensions.WebApi.OrderTracking.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;
using Insite.Order.Services.Results;
using Insite.Order.WebApi.V1.ApiModels;

namespace Extensions.WebApi.OrderTracking.Controllers
{
    [RoutePrefix("api/nbf/trackorder")]
    public class OrderTrackingController : BaseApiController
    {
        private readonly IOrderTrackingService _orderTrackingService;
        private readonly IGetTrackedOrderMapper _getTrackedOrderMapper;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;

        public OrderTrackingController(ICookieManager cookieManager, IOrderTrackingService orderTrackingService, IGetTrackedOrderMapper getTrackedOrderMapper, IUnitOfWorkFactory unitOfWorkFactory)
          : base(cookieManager)
        {
            _orderTrackingService = orderTrackingService;
            _getTrackedOrderMapper = getTrackedOrderMapper;
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

            var cleanPhone = phoneNumber.Replace("-", string.Empty);

            var matchedPhone = unitOfWork.GetRepository<Customer>().GetTableAsNoTracking().FirstOrDefault(x =>
                x.CustomerNumber.Equals(order.CustomerNumber) && (x.Phone.Equals(cleanPhone) || x.Phone.Replace("-", string.Empty).Replace(" ", string.Empty).Equals(cleanPhone)));

            if (matchedPhone == null)
            {
                return null;
            }

            return order.Id.ToString();
        }


        [Route("Details", Name = "TrackOrderDetails")]
        [ResponseType(typeof(OrderHistory))]
        public async Task<IHttpActionResult> Get(string orderId)
        {
            return await this.ExecuteAsync<IGetTrackedOrderMapper, string, GetTrackingOrderParameter, GetOrderResult, OrderModel>(this._getTrackedOrderMapper, new Func<GetTrackingOrderParameter, GetOrderResult>(this._orderTrackingService.GetOrder), orderId);
        }
    }
}
