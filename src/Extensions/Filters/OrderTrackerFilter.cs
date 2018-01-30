using System;
using Insite.ContentLibrary.Filters;
using Insite.ContentLibrary.Pages;
using Insite.Core.Context;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Order.Content;
using Insite.WebFramework.Content;
using Insite.WebFramework.Mvc;

namespace Extensions.Filters
{
    [DependencyOrder(801)]
    public class OrderTrackerFilter : BaseFilter<ContentPage>
    {
        private readonly IAuthenticationService _authenticationService;
        public OrderTrackerFilter(IActionResultFactory actionResultFactory, IAuthenticationService authenticationService)
            : base(actionResultFactory)
        {
            _authenticationService = authenticationService;
        }

        public override FilterResult Execute(ContentPage page)
        {
            //Only for InvoiceUserRole.  Other roles will supercede this.
            if (SiteContext.Current.UserProfile != null)
            {
                if (page.Name.EqualsIgnoreCase("Order Tracker") || page.Name.EqualsIgnoreCase("Order Tracker Details"))
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
