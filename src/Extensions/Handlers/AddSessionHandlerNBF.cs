using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Core.SystemSetting.Groups.AccountManagement;
using Insite.Customers.Services;
using Insite.Customers.Services.Parameters;
using Insite.Customers.Services.Results;
using Insite.Data.Entities;
using Insite.Data.Repositories.Interfaces;
using Insite.Plugins.Cart;
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

        public override int Order
        {
            get
            {
                return 500;
            }
        }

        public AddSessionHandlerNbf(IAuthenticationService authenticationService, ICustomerService customerService, ICartService cartService, IHandlerFactory handlerFactory, ISiteContextServiceFactory siteContextServiceFactory, IUserProfileUtilities userProfileUtilities, StorefrontUserPermissionsSettings storefrontUserPermissionsSettings, StorefrontSecuritySettings storefrontSecuritySettings, ICartOrderProviderFactory cartOrderProviderFactory)
        {
            this.StorefrontSecuritySettings = storefrontSecuritySettings;
            this.AuthenticationService = authenticationService;
            this.CustomerService = customerService;
            this.CartService = cartService;
            this.HandlerFactory = handlerFactory;
            this.SiteContextService = siteContextServiceFactory.GetSiteContextService();
            this.UserProfileUtilities = userProfileUtilities;
            this.StorefrontUserPermissionsSettings = storefrontUserPermissionsSettings;
            this.CartOrderProviderFactory = cartOrderProviderFactory;
        }

        public override AddSessionResult Execute(IUnitOfWork unitOfWork, AddSessionParameter parameter, AddSessionResult result)
        {
            UserProfile user;
            AddSessionResult addSessionResult = this.CheckForErrorResult(unitOfWork, parameter, result, out user);
            if (addSessionResult != null)
                return addSessionResult;
            this.AuthenticationService.SetUserAsAuthenticated(parameter.UserName);
            this.UpdateLastLoginOn(unitOfWork, parameter);
            try
            {
                if (SiteContext.Current.BillTo == null)
                    return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.NotFound, MessageProvider.Current.Customer_BillToNotFound);
                if (!this.StorefrontUserPermissionsSettings.AllowCreateNewShipToAddress && SiteContext.Current.ShipTo == null)
                    return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.AccountServiceContactCustomerSupport, MessageProvider.Current.Contact_Customer_Support);
                ICartService cartService = this.CartService;
                UpdateCartParameter parameter1 = new UpdateCartParameter();
                parameter1.BillToId = new Guid?(SiteContext.Current.BillTo.Id);
                Customer shipTo = SiteContext.Current.ShipTo;
                Guid? nullable = new Guid?(shipTo != null ? shipTo.Id : SiteContext.Current.BillTo.Id);
                parameter1.ShipToId = nullable;
                //UpdateCartResult updateCartResult = cartService.UpdateCart(parameter1);
                //if (updateCartResult.ResultCode != ResultCode.Success)
                //    return this.CreateErrorServiceResult<AddSessionResult>(result, updateCartResult.SubCode, updateCartResult.Message);
                unitOfWork.Save();

                // Get the two carts that may be the user's:
                // - one created while not logged in, and 
                // - any cart that was created during a previous logged in session.
                var cartOrderProvider = CartOrderProviderFactory.GetCartOrderProvider();
                var usersCart = unitOfWork.GetRepository<CustomerOrder>().GetTable()
                    .FirstOrDefault(co => co.PlacedByUserProfileId == user.Id && co.Status == "Cart");
                var anonymousCart = cartOrderProvider.GetCartOrder();
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
                        var addCartLineResult = CartService.AddCartLine(addCartLineParameter);
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
                            unitOfWork.Save();
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

                Insite.Data.Entities.Currency currency1 = SiteContext.Current.Currency;
                Insite.Data.Entities.Currency currency2 = SiteContext.Current.BillTo.Currency;
                this.SiteContextService.SetPersona(new Guid?(), true);
                if (currency2 != null && currency2.Id != currency1.Id)
                    this.SiteContextService.SetCurrency(new Guid?(SiteContext.Current.BillTo.Currency.Id));
                if (parameter.RememberMe && this.StorefrontSecuritySettings.RememberMe)
                    this.SiteContextService.SetRememberedUserProfile(new SetRememberedUserProfileParameter(parameter.UserName, this.StorefrontSecuritySettings.DaysToRetainUser));
                else
                    this.SiteContextService.SetRememberedUserProfile(new SetRememberedUserProfileParameter((string)null, 30));
                result.GetSessionResult = this.HandlerFactory.GetHandler<IHandler<GetSessionParameter, GetSessionResult>>().Execute(unitOfWork, new GetSessionParameter(), new GetSessionResult());
                result.GetSessionResult.IsAuthenticated = true;
            }
            catch (Exception ex)
            {
                this.AuthenticationService.SignOut();
                throw;
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }

        protected override T CreateErrorServiceResult<T>(T result, SubCode subCode, string message = null)
        {
            this.AuthenticationService.SignOut();
            return base.CreateErrorServiceResult<T>(result, subCode, message);
        }

        protected virtual void UpdateLastLoginOn(IUnitOfWork unitOfWork, AddSessionParameter parameter)
        {
            unitOfWork.GetTypedRepository<IUserProfileRepository>().GetByUserName(parameter.UserName).LastLoginOn = new DateTimeOffset?(DateTimeProvider.Current.Now);
        }

        private GetShipToCollectionResult GetShipToCollectionResult(Guid billToId)
        {
            GetShipToCollectionParameter parameter = new GetShipToCollectionParameter();
            parameter.BillToId = new Guid?(billToId);
            int num1 = 0;
            parameter.ExcludeBillTo = num1 != 0;
            int num2 = 1;
            parameter.ExcludeShowAll = num2 != 0;
            int? nullable1 = new int?(1);
            parameter.Page = nullable1;
            int? nullable2 = new int?(1);
            parameter.PageSize = nullable2;
            return this.CustomerService.GetShipToCollection(parameter);
        }

        private AddSessionResult CheckForErrorResult(IUnitOfWork unitOfWork, AddSessionParameter parameter, AddSessionResult result, out UserProfile userProfile)
        {
            userProfile = null;
            if (!parameter.IsExternalIdentity && !this.AuthenticationService.ValidateUser(parameter.UserName, parameter.Password))
                return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.AccountServiceInvalidUserNameOrPassword, MessageProvider.Current.SignInInfo_UserNamePassword_Combination);
            UserProfile byUserName = unitOfWork.GetTypedRepository<IUserProfileRepository>().GetByUserName(parameter.UserName);
            if (byUserName == null)
                return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.AccountServiceUserProfileNotFound, MessageProvider.Current.SignInInfo_UserNamePassword_Combination);
            if (byUserName.IsDeactivated)
                return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.Deactivated, MessageProvider.Current.SignInInfo_User_IsDeactivated);
            if (byUserName.IsPasswordChangeRequired)
                return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.PasswordExpired, MessageProvider.Current.SignInInfo_UserNamePassword_ChangeRequired);
            if (this.AuthenticationService.IsLockedOut(byUserName.UserName))
                return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.LockedOut, MessageProvider.Current.SignInInfo_UserLockedOut);
            if (!this.UserProfileUtilities.IsAllowedForWebsite(byUserName, SiteContext.Current.Website))
                return this.CreateErrorServiceResult<AddSessionResult>(result, SubCode.AccountServiceUserNotAllowedForWebsite, MessageProvider.Current.SignInInfo_UserNotAllowedForWebsite);
            byUserName.LastLoginOn = new DateTimeOffset?((DateTimeOffset)DateTime.Now);
            userProfile = byUserName;
            return (AddSessionResult)null;
        }
    }
}
