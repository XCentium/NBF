using DotLiquid;

namespace Extensions.Widgets
{
    public class CheckoutViewDrop : Drop
    {
        public bool IsCloudPaymentGateway { get; set; }

        public string HostedPciFrameHost { get; set; }

        public string HostedPciFrameFullUrl { get; set; }
    }
}
