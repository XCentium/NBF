using Insite.Core.Services;

namespace Extensions.WebApi.Models
{
    public class GetTrackingOrderParameter : ParameterBase
    {
        public string OrderId { get; set; }

        public bool GetOrderLines { get; set; }

        public bool GetShipments { get; set; }

        public GetTrackingOrderParameter(string orderId)
        {
            this.OrderId = orderId;
        }
    }
}
