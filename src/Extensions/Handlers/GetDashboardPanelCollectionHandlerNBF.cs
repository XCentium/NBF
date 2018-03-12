using System;
using Insite.Account.Content;
using Insite.Cart.Services;
using Insite.Cart.Services.Parameters;
using Insite.ContentLibrary.Pages;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using Insite.Dashboard.Services.Dtos;
using Insite.Dashboard.Services.Parameters;
using Insite.Dashboard.Services.Results;
using Insite.Invoice.Content;
using Insite.JobQuote.Content;
using Insite.Order.Content;
using Insite.OrderApproval.Content;
using Insite.Requisition.Content;
using Insite.Requisition.Services;
using Insite.Requisition.Services.Parameters;
using Insite.Rfq.Content;
using Insite.Rfq.Services;
using Insite.Rfq.Services.Parameters;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using Insite.WebFramework.Routing;
using System.Collections.Generic;
using System.Linq;
using Insite.Account.Services;
using Insite.Account.Services.Parameters;
using Insite.Data.Entities.Dtos;
using Insite.Invoice.Services;
using Insite.Invoice.Services.Parameters;
using Insite.Order.Services;
using Insite.Order.Services.Parameters;
using Insite.WishLists.Content;
using Insite.WishLists.Services;
using Insite.WishLists.Services.Parameters;

namespace Insite.Dashboard.Services.Handlers
{
    [DependencyName("GetDashboardsHandler")]
    public class GetDashboardPanelCollectionHandlerNbf : HandlerBase<GetDashboardPanelCollectionParameter, GetDashboardPanelCollectionResult>
    {
        protected readonly ICartService CartService;
        protected readonly IContentHelper ContentHelper;
        protected readonly IHandlerFactory HandlerFactory;
        protected readonly IQuoteService QuoteService;
        protected readonly IOrderService OrderService;
        protected readonly IAccountService AccountService;
        protected readonly IInvoiceService InvoiceService;
        protected readonly IWishListService WishListService;
        protected readonly IRequisitionService RequisitionService;
        protected readonly IUrlProvider UrlProvider;

        public override int Order => 500;

        public GetDashboardPanelCollectionHandlerNbf(IHandlerFactory handlerFactory, IContentHelper contentHelper, IRequisitionService requisitionService, IQuoteService quoteService, IOrderService orderService, IAccountService accountService, IInvoiceService invoiceService, IWishListService wishListService, ICartService cartService, IUrlProvider urlProvider)
        {
            HandlerFactory = handlerFactory;
            ContentHelper = contentHelper;
            RequisitionService = requisitionService;
            QuoteService = quoteService;
            OrderService = orderService;
            AccountService = accountService;
            InvoiceService = invoiceService;
            WishListService = wishListService;
            CartService = cartService;
            UrlProvider = urlProvider;
        }

        public override GetDashboardPanelCollectionResult Execute(IUnitOfWork unitOfWork, GetDashboardPanelCollectionParameter parameter, GetDashboardPanelCollectionResult result)
        {
            List<DashboardPanelDto> source = new List<DashboardPanelDto>();
            GetPageResult<MyAccountPage> page = ContentHelper.GetPage<MyAccountPage>(false);
            if (page.Page != null && page.DisplayLink)
                source = ContentHelper.GetChildPagesForVariantKey<ContentPage>(page.Page.VariantKey.Value, false).Where(x => !x.ExcludeFromNavigation).Select(x => new DashboardPanelDto()
                {
                    Type = x.GetType(),
                    Text = x.Title,
                    Url = UrlProvider.PrepareUrl(x.Url)
                }).ToList();
            foreach (DashboardPanelDto dashboardPanelDto in source)
                SetUpPanelDto(dashboardPanelDto);
            result.DashboardPanels = source.OrderBy(x => x.IsPanel).ThenBy(x => x.Order).ThenBy(x => x.Text).ToList();
            return NextHandler.Execute(unitOfWork, parameter, result);
        }

        private void SetUpPanelDto(DashboardPanelDto dashboardPanelDto)
        {

            if (dashboardPanelDto.Type == typeof(OrdersPage))
            {
                dashboardPanelDto.PanelType = "Orders";
                dashboardPanelDto.IsPanel = true;
                var orders = OrderService.GetOrderCollection(new GetOrderCollectionParameter());
                dashboardPanelDto.Count = orders.TotalCount;
                dashboardPanelDto.Order = 100;
            }
            else if (dashboardPanelDto.Type == typeof(RfqMyQuotesPage))
            {
                dashboardPanelDto.PanelType = "RequestForQuote";
                dashboardPanelDto.IsPanel = true;
                dashboardPanelDto.Count = QuoteService.GetQuoteCollection(new GetQuoteCollectionParameter()).TotalCount;
                dashboardPanelDto.Order = 110;
            }
            else if (dashboardPanelDto.Type == typeof(InvoicesPage))
            {
                dashboardPanelDto.PanelType = "Invoices";
                dashboardPanelDto.IsPanel = true;
                dashboardPanelDto.Count = InvoiceService.GetInvoiceCollection(new GetInvoiceCollectionParameter() {
                    CustomerSequence = "-1",
                    FromDate = DateTime.Now.AddYears(-1),
                    Sort = "InvoiceDate DESC",
                    PageSize = 15000,
                    Page = 1
                }).TotalCount;
                dashboardPanelDto.Order = 120;
            }
            else if (dashboardPanelDto.Type == typeof(OrderApprovalListPage))
            {
                dashboardPanelDto.PanelType = "OrderApprovals";
                dashboardPanelDto.IsPanel = true;
                dashboardPanelDto.Count = CartService.GetCartCollection(new GetCartCollectionParameter() { Status = "AwaitingApproval" }).TotalCount;
                dashboardPanelDto.Order = 130;
            }
            else if (dashboardPanelDto.Type == typeof(ContentPage) && dashboardPanelDto.Text == "Payment Options")
            {
                dashboardPanelDto.PanelType = "Payment Options";
                dashboardPanelDto.IsPanel = true;
                //todo payment option count
                dashboardPanelDto.Count = 0;
                dashboardPanelDto.Order = 150;
            }
            else if (dashboardPanelDto.Type == typeof(MyAccountAddressPage))
            {
                dashboardPanelDto.PanelType = "My Addresses";
                dashboardPanelDto.IsPanel = true;
                var count = AccountService.GetAccount(new GetAccountParameter()).UserProfile.Customers;
                dashboardPanelDto.Count = count.Count;
                dashboardPanelDto.Order = 160;
            }
            else if (dashboardPanelDto.Type == typeof(AccountSettingsPage))
            {
                dashboardPanelDto.PanelType = "Account Settings";
                dashboardPanelDto.IsPanel = true;
                //todo account settings count ?
                dashboardPanelDto.Count = -1;
                dashboardPanelDto.Order = 170;
            }
            else if (dashboardPanelDto.Type == typeof(MyListsPage))
            {
                dashboardPanelDto.PanelType = "Favorites";
                dashboardPanelDto.IsPanel = true;
                dashboardPanelDto.Count = WishListService.GetWishListCollection(new GetWishListCollectionParameter()).WishLists.First().WishListProducts.Count;
                dashboardPanelDto.Order = 200;
            }
            else if (dashboardPanelDto.Type == typeof(RequisitionPage))
            {
                dashboardPanelDto.PanelType = "Requisitions";
                dashboardPanelDto.IsPanel = true;
                dashboardPanelDto.Count = RequisitionService.GetRequisitionCollection(new GetRequisitionCollectionParameter()).TotalCount;
                dashboardPanelDto.Order = 200;
            }
            else
            {
                if (!(dashboardPanelDto.Type == typeof(MyJobQuotesPage)))
                    return;
                dashboardPanelDto.IsQuickLink = true;
                dashboardPanelDto.QuickLinkText = ContentHelper.T("My Jobs");
                dashboardPanelDto.QuickLinkOrder = 5;
            }
        }
    }
}
