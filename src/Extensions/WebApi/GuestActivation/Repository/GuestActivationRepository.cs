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

namespace Extensions.WebApi.GuestActivation.Repository
{
    public class GuestActivationRepository : BaseRepository, IGuestActivationRepository
    {
        private readonly IUnitOfWork _unitOfWork;

        public GuestActivationRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public AccountModel ActivateGuest(GuestActivationParameter model)
        {
            var account = _unitOfWork.GetRepository<UserProfile>().GetTable().FirstOrDefault(x =>
                x.Id.ToString().Equals(model.GuestId, StringComparison.CurrentCultureIgnoreCase));

            if (account != null)
            {
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