using System;
using Extensions.Settings;
using Insite.ContentLibrary.Filters;
using Insite.ContentLibrary.Pages;
using Insite.Core.Context;
using Insite.Core.Interfaces.Dependency;
using Insite.Order.Content;
using Insite.WebFramework.Content;
using Insite.WebFramework.Mvc;

namespace Extensions.Filters
{
    [DependencyOrder(801)]
    public class OrderTrackerFilter : BaseFilter<ContentPage>
    {
        private readonly OrderTrackerSettings _orderTrackerSettings;
        public OrderTrackerFilter(IActionResultFactory actionResultFactory, OrderTrackerSettings orderTrackerSettings)
            : base(actionResultFactory)
        {
            _orderTrackerSettings = orderTrackerSettings;
        }

        public override FilterResult Execute(ContentPage page)
        {
            //Only for InvoiceUserRole.  Other roles will supercede this.
            if (SiteContext.Current.UserProfileDto != null)
            {
                var orderTrackerUrl = _orderTrackerSettings.OrderTrackerUrl;
                var orderTrackerDetailUrl = _orderTrackerSettings.OrderTrackerDetailUrl;

                if (page.Url.EqualsIgnoreCase(orderTrackerUrl) || page.Url.EqualsIgnoreCase(orderTrackerDetailUrl))
                {
                    return new FilterResult
                    {
                        DisplayLink = true,
                        ReplacementAction = ActionResultFactory.RedirectTo<OrdersPage>()
                    };
                }
            }
            return null;
        }
    }
}
