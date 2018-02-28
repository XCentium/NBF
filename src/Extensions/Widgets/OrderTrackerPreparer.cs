using Extensions.Settings;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;

namespace Extensions.Widgets
{
    public class OrderTrackerPreparer : GenericPreparer<OrderTracker>
    {
        protected readonly OrderTrackerSettings OrderTrackerSettings;

        public OrderTrackerPreparer(ITranslationLocalizer translationLocalizer, OrderTrackerSettings orderTrackerSettings)
            : base(translationLocalizer)
        {
            OrderTrackerSettings = orderTrackerSettings;
        }

        public override void Prepare(OrderTracker contentItem)
        {
            contentItem.OrderTrackerDetailsUrl = OrderTrackerSettings.OrderTrackerDetailUrl;
        }
    }
}
