using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Common.Logging;
using Insite.Common.Providers;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.Cart;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Plugins.PromotionEngine;
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Core.SystemSetting.Groups.Shipping;
using Insite.Data.Entities;
using Insite.Data.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Extensions.Cart.Handlers
{
    [DependencyName("SubmitCart")]
    public sealed class SubmitCart : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        private readonly Lazy<ICartOrderProviderFactory> cartOrderProviderFactory;
        private readonly Lazy<IPromotionEngine> promotionEngine;
        private readonly Lazy<IProductUtilities> productUtilities;
        private readonly ICustomerOrderUtilities customerOrderUtilities;
        private readonly IPricingPipeline pricingPipeline;
        private readonly OrderManagementGeneralSettings orderManagementGeneralSettings;
        private readonly ShippingGeneralSettings shippingGeneralSettings;
        private readonly RfqSettings rfqSettings;

        public List<string> CanSubmitCartStatuses
        {
            get
            {
                return new List<string>()
        {
          "Cart",
          "QuoteProposed",
          "Saved",
          "PunchOut",
          "PunchOutOrderRequest",
          "AwaitingApproval"
        };
            }
        }

        public SubmitCart(Lazy<IPromotionEngine> promotionEngine, Lazy<IProductUtilities> productUtilities, Lazy<ICartOrderProviderFactory> cartOrderProviderFactory, ICustomerOrderUtilities customerOrderUtilities, ShippingGeneralSettings shippingGeneralSettings, RfqSettings rfqSettings, IPricingPipeline pricingPipeline, OrderManagementGeneralSettings orderManagementGeneralSettings)
        {
            this.promotionEngine = promotionEngine;
            this.productUtilities = productUtilities;
            this.cartOrderProviderFactory = cartOrderProviderFactory;
            this.customerOrderUtilities = customerOrderUtilities;
            this.shippingGeneralSettings = shippingGeneralSettings;
            this.rfqSettings = rfqSettings;
            this.pricingPipeline = pricingPipeline;
            this.orderManagementGeneralSettings = orderManagementGeneralSettings;
        }

        public override int Order
        {
            get
            {
                return 2300;
            }
        }

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (!parameter.Status.EqualsIgnoreCase("Submitted"))
                return this.NextHandler.Execute(unitOfWork, parameter, result);
            if (SiteContext.Current.UserProfile == null)
                return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartServiceSignInTimedOut, MessageProvider.Current.ReviewAndPay_SignIn_TimedOut);
            CustomerOrder cart = result.GetCartResult.Cart;
            if (!cart.OrderLines.Any<OrderLine>())
                return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartServiceNoOrderLines, MessageProvider.Current.Cart_NoOrderLines);
            if (result.GetCartResult.HasRestrictedProducts)
                return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartServiceHasRestrictedOrderLine, MessageProvider.Current.Cart_ProductsCannotBePurchased);
            if (result.GetCartResult.RequiresPoNumber && result.GetCartResult.ShowPoNumber && (cart.CustomerPO.IsBlank() && !parameter.IsPayPal))
                return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartServiceCustomerPoRequired, MessageProvider.Current.ReviewAndPay_PONumber_Required);
            if (!this.shippingGeneralSettings.AllowEmptyShipping && cart.ShipVia == null)
                return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartServiceInvalidShipVia, MessageProvider.Current.Checkout_Invalid_Shipping_Selection);
            if (cart.Status.EqualsIgnoreCase("QuoteRequested"))
            {
                if (cart.Type == "Quote")
                    return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartAlreadySubmitted, "This Quote has already been Requested and can not be requested again");
                cart.Type = "Quote";
            }
            if (!this.CanSubmitCartStatuses.Contains(cart.Status))
                return this.CreateErrorServiceResult<UpdateCartResult>(result, SubCode.CartAlreadySubmitted, "This Order has already been Submitted and can not be submitted again");
            if (cart.Status.EqualsIgnoreCase("QuoteProposed"))
            {
                GetCartPricingResult cartPricing = this.pricingPipeline.GetCartPricing(new GetCartPricingParameter(cart)
                {
                    CalculateOrderTotal = false
                });
                if (cartPricing.ResultCode != ResultCode.Success)
                    return this.CreateErrorServiceResult<UpdateCartResult>(result, cartPricing.SubCode, cartPricing.Message);
                CustomerOrder customerOrder = cart;
                DateTimeOffset? nullable = new DateTimeOffset?(customerOrder.QuoteExpirationDate ?? (DateTimeOffset)DateTimeProvider.Current.Now.Date.AddDays((double)(this.rfqSettings.QuoteExpireDays + 1)).AddMinutes(-1.0));
                customerOrder.QuoteExpirationDate = nullable;
                this.promotionEngine.Value.ClearPromotions(cart);
            }
            var orderReference = cart.OrderNumber;
            this.SetCustomerOrderNumber(unitOfWork, cart);
            foreach (var transaction in cart.CreditCardTransactions)
            {
                transaction.OrderNumber = cart.OrderNumber;
                transaction.CustomerOrderId = cart.Id;
            }
            this.SetCustomerOrderInfo(cart);
            cart.Status = "Submitted";
            if (cart.Type == "Order")
            {
                List<OrderLine> list = cart.OrderLines.Where<OrderLine>((Func<OrderLine, bool>)(line => this.productUtilities.Value.IsQuoteRequired(line.Product))).ToList<OrderLine>();
                this.MoveQuotedCartLinesBackToCart(cart, (IList<OrderLine>)list);
            }
            try
            {
                unitOfWork.Save();
            }
            catch (Exception ex)
            {
                LogHelper.For((object)this).Error((object)ex.Message, ex, nameof(SubmitCart), (object)null);
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        /// <summary>Moves cart lines which require Quote to current customer order (Cart).</summary>
        /// <param name="cart">Submitted Customer Order</param>
        /// <param name="quotedCartLines">List of cart line</param>
        private void MoveQuotedCartLinesBackToCart(CustomerOrder cart, IList<OrderLine> quotedCartLines)
        {
            CustomerOrder cartOrder = this.cartOrderProviderFactory.Value.GetCartOrderProvider().GetOrCreateCartOrder();
            foreach (OrderLine quotedCartLine in (IEnumerable<OrderLine>)quotedCartLines)
            {
                this.customerOrderUtilities.RemoveOrderLine(cart, quotedCartLine);
                this.customerOrderUtilities.AddOrderLine(cartOrder, quotedCartLine);
            }
        }

        /// <summary>Sets the customer order number.</summary>
        /// <param name="unitOfWork">The unit of work.</param>
        /// <param name="customerOrder">The customer order.</param>
        private void SetCustomerOrderNumber(IUnitOfWork unitOfWork, CustomerOrder customerOrder)
        {
            if (!customerOrder.OrderNumber.IsGuid())
                return;
            ICustomerOrderRepository typedRepository = unitOfWork.GetTypedRepository<ICustomerOrderRepository>();
            customerOrder.OrderNumber = typedRepository.GetNextOrderNumber(this.orderManagementGeneralSettings.OrderNumberPrefix, this.orderManagementGeneralSettings.OrderNumberFormat);
        }

        /// <summary>Sets basic properties on the provided <see cref="T:Insite.Data.Entities.CustomerOrder" /></summary>
        /// <param name="customerOrder"><see cref="T:Insite.Data.Entities.CustomerOrder" /> to set properties</param>
        /// <remarks>if the Current <see cref="T:Insite.Data.Entities.UserProfile" /> is not null set the <see cref="T:Insite.Data.Entities.CustomerOrder" />'s user profile to the current value.
        /// Set the <see cref="T:Insite.Data.Entities.CustomerOrder" />'s OrderDate to now</remarks>
        private void SetCustomerOrderInfo(CustomerOrder customerOrder)
        {
            if (customerOrder.PlacedByUserProfile == null)
            {
                customerOrder.PlacedByUserProfile = SiteContext.Current.UserProfile;
                customerOrder.PlacedByUserName = SiteContext.Current.UserProfile.UserName;
            }
            customerOrder.OrderDate = DateTimeProvider.Current.Now;
            if (!customerOrder.RequestedShipDate.HasValue)
            {
                CustomerOrder customerOrder1 = customerOrder;
                DateTimeOffset? nullable = new DateTimeOffset?(customerOrder1.OrderDate);
                customerOrder1.RequestedShipDate = nullable;
            }
            if (customerOrder.CurrencyId.HasValue || SiteContext.Current.CurrencyDto == null)
                return;
            this.customerOrderUtilities.SetCurrency(customerOrder, SiteContext.Current.CurrencyDto.Id);
        }
    }
}
