using System;
using System.Linq;
using Extensions.WebApi.Base;
using Extensions.WebApi.GuestActivation.Interfaces;
using Extensions.WebApi.GuestActivation.Models;
using Insite.Account.WebApi.V1.ApiModels;
using Insite.Catalog.Services;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;
using Insite.Data.Entities;
using Insite.WishLists.Services;
using Insite.WishLists.Services.Parameters;

namespace Extensions.WebApi.GuestActivation.Repository
{
    public class GuestActivationRepository : BaseRepository, IGuestActivationRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWishListService _wishListService;

        public GuestActivationRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService, IWishListService wishListService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            _wishListService = wishListService;
        }

        public AccountModel ActivateGuest(GuestActivationParameter model)
        {
            var account = _unitOfWork.GetRepository<UserProfile>().GetTable().FirstOrDefault(x =>
                x.Id.ToString().Equals(model.GuestId, StringComparison.CurrentCultureIgnoreCase));

            if (account != null)
            {
                //Add wishlist for user if not exists
                var favoritesList = _unitOfWork.GetRepository<WishList>().GetTable().FirstOrDefault(x => x.Name.Equals("Favorites", StringComparison.CurrentCultureIgnoreCase));
                if (favoritesList == null)
                {
                    var param = new AddWishListParameter {Name = "Favorites"};
                    _wishListService.AddWishList(param);
                }

                //Delete customer Insite creates that becomes unused
                var unusedCustomer = account.Customers.FirstOrDefault(x => x != SiteContext.Current.BillTo);
                if (unusedCustomer != null)
                {
                    _unitOfWork.GetRepository<Customer>().Delete(unusedCustomer);
                }

                //Set properties
                account.IsGuest = false;
                account.FirstName = model.Account.FirstName;
                account.LastName = model.Account.LastName;
                account.Email = model.Account.Email;
                account.UserName = model.Account.UserName;

                _unitOfWork.Save();
            }
            else
            {
                throw new Exception("Account cannot be found");
            }

            return model.Account;
        }
    }
}