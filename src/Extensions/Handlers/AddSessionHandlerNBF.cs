using System;
using System.Linq;
using Insite.Account.Services.Parameters;
using Insite.Account.Services.Results;
using Insite.Account.SystemSettings;
using Insite.Cart.Services;
using Insite.Cart.Services.Dtos;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Common.Logging;
using Insite.Common.Providers;
using Insite.Core.Context;
using Insite.Core.Context.Services.Parameters;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Core.Plugins.Cart;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Utilities;
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Core.SystemSetting.Groups.AccountManagement;
using Insite.Customers.Services;
using Insite.Customers.Services.Parameters;
using Insite.Customers.Services.Results;
using Insite.Data.Entities;
using Insite.Data.Repositories.Interfaces;
using Newtonsoft.Json;

namespace Extensions.Handlers
{
    [DependencyName("AddSessionHandler")]
    public class AddSessionHandlerNbf : HandlerBase<AddSessionParameter, AddSessionResult>
    {
        protected readonly IAuthenticationService AuthenticationService;
        protected readonly ICartService CartService;
        protected readonly ICustomerService CustomerService;
        protected readonly IHandlerFactory HandlerFactory;
        protected readonly ISiteContextService SiteContextService;
        protected readonly IUserProfileUtilities UserProfileUtilities;
        protected readonly StorefrontUserPermissionsSettings StorefrontUserPermissionsSettings;
        protected readonly StorefrontSecuritySettings StorefrontSecuritySettings;
        protected readonly ICartOrderProviderFactory CartOrderProviderFactory;
        protected readonly ICookieManager CookieManager;
        public override int Order => 500;

        public AddSessionHandlerNbf(IAuthenticationService authenticationService, ICustomerService customerService, ICartService cartService, IHandlerFactory handlerFactory, ISiteContextServiceFactory siteContextServiceFactory, IUserProfileUtilities userProfileUtilities, StorefrontUserPermissionsSettings storefrontUserPermissionsSettings, StorefrontSecuritySettings storefrontSecuritySettings, ICartOrderProviderFactory cartOrderProviderFactory, ICookieManager cookieManager)
        {
            StorefrontSecuritySettings = storefrontSecuritySettings;
            AuthenticationService = authenticationService;
            CustomerService = customerService;
            CartService = cartService;
            HandlerFactory = handlerFactory;
            SiteContextService = siteContextServiceFactory.GetSiteContextService();
            UserProfileUtilities = userProfileUtilities;
            StorefrontUserPermissionsSettings = storefrontUserPermissionsSettings;
            CartOrderProviderFactory = cartOrderProviderFactory;
            CookieManager = cookieManager;
        }

        public override AddSessionResult Execute(IUnitOfWork unitOfWork, AddSessionParameter parameter, AddSessionResult result)
        {
            UserProfile user;

            var guestCartId = CookieManager.Get("guestCartId");
            CookieManager.Remove("guestCartId");

            var addSessionResult = CheckForErrorResult(unitOfWork, parameter, result, out user);
            if (addSessionResult != null)
                return addSessionResult;
            AuthenticationService.SetUserAsAuthenticated(parameter.UserName);
            UpdateLastLoginOn(unitOfWork, parameter);
            try
            {
                if (SiteContext.Current.BillTo == null)
                    return CreateErrorServiceResult(result, SubCode.NotFound, MessageProvider.Current.Customer_BillToNotFound);
                if (!StorefrontUserPermissionsSettings.AllowCreateNewShipToAddress && SiteContext.Current.ShipTo == null)
                    return CreateErrorServiceResult(result, SubCode.AccountServiceContactCustomerSupport, MessageProvider.Current.Contact_Customer_Support);

                unitOfWork.Save();

                // Get the two carts that may be the user's:
                // - one created while not logged in, and 
                // - any cart that was created during a previous logged in session.
                var cartOrderProvider = CartOrderProviderFactory.GetCartOrderProvider();
                var usersCart = unitOfWork.GetRepository<CustomerOrder>().GetTable()
                    .FirstOrDefault(co => co.PlacedByUserProfileId == user.Id && co.Status == "Cart");
                var anonymousCart = unitOfWork.GetRepository<CustomerOrder>().GetTable()
                    .FirstOrDefault(co => co.OrderNumber.ToString().Equals(guestCartId, StringComparison.CurrentCultureIgnoreCase) && co.Status == "Cart");
                if (usersCart != null && anonymousCart != null && usersCart.Id != anonymousCart.Id)
                {
                    // If we have both, copy the anonymous cart order lines into the previous cart.
                    foreach (var orderLine in anonymousCart.OrderLines.Where(ol => !ol.IsPromotionItem))
                    {
                        var addCartLineParameter = new AddCartLineParameter(new CartLineDto
                        {
                            ProductId = orderLine.ProductId,
                            QtyOrdered = orderLine.QtyOrdered,
                            UnitOfMeasure = orderLine.UnitOfMeasure
                        }) {CartId = usersCart.Id};
                        foreach (var property in orderLine.CustomProperties)
                        {
                            addCartLineParameter.Properties.Add(property.Name, property.Value);
                        }
                        CartService.AddCartLine(addCartLineParameter);
                    }

                    unitOfWork.GetRepository<CustomerOrder>().Delete(anonymousCart);
                    unitOfWork.Save();

                    cartOrderProvider.SetCartOrder(usersCart);
                }
                else if (usersCart == null && anonymousCart != null)
                {
                    var updateCartParameter = new UpdateCartParameter
                    {
                        BillToId = SiteContext.Current.BillTo.Id,
                        ShipToId = SiteContext.Current.ShipTo?.Id ?? SiteContext.Current.BillTo.Id
                    };

                    var updateCartResult = CartService.UpdateCart(updateCartParameter);
                    if (updateCartResult.ResultCode != ResultCode.Success)
                        return CreateErrorServiceResult(result, updateCartResult.SubCode, updateCartResult.Message);

                    updateCartResult.GetCartResult.Cart.PlacedByUserProfile = user;
                    updateCartResult.GetCartResult.Cart.PlacedByUserName = user.UserName;
                    updateCartResult.GetCartResult.Cart.InitiatedByUserProfile = user;

                    unitOfWork.Save();
                    
                    try
                    {
                        var getCartParameter = new GetCartParameter
                        {
                            GetValidation = true
                        };
                        var getCartResult = HandlerFactory.GetHandler<IHandler<GetCartParameter, GetCartResult>>()
                            .Execute(unitOfWork, getCartParameter, new GetCartResult());
                        if (getCartResult.ResultCode != ResultCode.Success)
                        {
                            LogHelper.For(this)
                                .Error($"Error validating user's cart during login: {JsonConvert.SerializeObject(getCartResult)}");
                        } else {
                            foreach (var orderLine in anonymousCart.OrderLines.Where(ol => !ol.IsPromotionItem))
                            {
                                var addCartLineParameter = new AddCartLineParameter(new CartLineDto
                                {
                                    ProductId = orderLine.ProductId,
                                    QtyOrdered = orderLine.QtyOrdered,
                                    UnitOfMeasure = orderLine.UnitOfMeasure
                                });
                                foreach (var property in orderLine.CustomProperties)
                                {
                                    addCartLineParameter.Properties.Add(property.Name, property.Value);
                                }
                                CartService.AddCartLine(addCartLineParameter);
                            }

                            unitOfWork.GetRepository<CustomerOrder>().Delete(anonymousCart);
                            unitOfWork.Save();

                            cartOrderProvider.SetCartOrder(getCartResult.Cart);
                        }
                    }
                    catch (Exception e)
                    {
                        LogHelper.For(this).Error(e);
                    }
                }
                else if (usersCart != null)
                {
                    cartOrderProvider.SetCartOrder(usersCart);
                }

                var currency1 = SiteContext.Current.CurrencyDto;
                var currency2 = SiteContext.Current.BillTo.Currency;
                SiteContextService.SetPersona(new Guid?(), true);
                if (currency2 != null && currency2.Id != currency1.Id)
                    SiteContextService.SetCurrency(SiteContext.Current.BillTo.Currency.Id);
                if (parameter.RememberMe && StorefrontSecuritySettings.RememberMe)
                    SiteContextService.SetRememberedUserProfile(new SetRememberedUserProfileParameter(parameter.UserName, StorefrontSecuritySettings.DaysToRetainUser));
                else
                    SiteContextService.SetRememberedUserProfile(new SetRememberedUserProfileParameter(null));
                result.GetSessionResult = HandlerFactory.GetHandler<IHandler<GetSessionParameter, GetSessionResult>>().Execute(unitOfWork, new GetSessionParameter(), new GetSessionResult());
                result.GetSessionResult.IsAuthenticated = true;
            }
            catch (Exception)
            {
                AuthenticationService.SignOut();
                throw;
            }
            return NextHandler.Execute(unitOfWork, parameter, result);
        }

        protected override T CreateErrorServiceResult<T>(T result, SubCode subCode, string message = null)
        {
            AuthenticationService.SignOut();
            return base.CreateErrorServiceResult(result, subCode, message);
        }

        protected virtual void UpdateLastLoginOn(IUnitOfWork unitOfWork, AddSessionParameter parameter)
        {
            unitOfWork.GetTypedRepository<IUserProfileRepository>().GetByUserName(parameter.UserName).LastLoginOn = DateTimeProvider.Current.Now;
        }

        private GetShipToCollectionResult GetShipToCollectionResult(Guid billToId)
        {
            var parameter = new GetShipToCollectionParameter();
            parameter.BillToId = billToId;
            var num1 = 0;
            parameter.ExcludeBillTo = num1 != 0;
            var num2 = 1;
            parameter.ExcludeShowAll = num2 != 0;
            int? nullable1 = 1;
            parameter.Page = nullable1;
            int? nullable2 = 1;
            parameter.PageSize = nullable2;
            return CustomerService.GetShipToCollection(parameter);
        }

        private AddSessionResult CheckForErrorResult(IUnitOfWork unitOfWork, AddSessionParameter parameter, AddSessionResult result, out UserProfile userProfile)
        {
            userProfile = null;
            if (!parameter.IsExternalIdentity && !AuthenticationService.ValidateUser(parameter.UserName, parameter.Password))
                return CreateErrorServiceResult(result, SubCode.AccountServiceInvalidUserNameOrPassword, MessageProvider.Current.SignInInfo_UserNamePassword_Combination);
            var byUserName = unitOfWork.GetTypedRepository<IUserProfileRepository>().GetByUserName(parameter.UserName);
            if (byUserName == null)
                return CreateErrorServiceResult(result, SubCode.AccountServiceUserProfileNotFound, MessageProvider.Current.SignInInfo_UserNamePassword_Combination);
            if (byUserName.IsDeactivated)
                return CreateErrorServiceResult(result, SubCode.Deactivated, MessageProvider.Current.SignInInfo_User_IsDeactivated);
            if (byUserName.IsPasswordChangeRequired)
                return CreateErrorServiceResult(result, SubCode.PasswordExpired, MessageProvider.Current.SignInInfo_UserNamePassword_ChangeRequired);
            if (AuthenticationService.IsLockedOut(byUserName.UserName))
                return CreateErrorServiceResult(result, SubCode.LockedOut, MessageProvider.Current.SignInInfo_UserLockedOut);
            if (!UserProfileUtilities.IsAllowedForWebsite(byUserName, SiteContext.Current.WebsiteDto))
                return CreateErrorServiceResult(result, SubCode.AccountServiceUserNotAllowedForWebsite, MessageProvider.Current.SignInInfo_UserNotAllowedForWebsite);
            byUserName.LastLoginOn = DateTime.Now;
            userProfile = byUserName;
            return null;
        }
    }
}
