using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.Mappers.Interfaces;
using Extensions.WebApi.GuestCheckout.Models;
using Insite.Account.Services;
using Insite.Account.Services.Parameters;
using Insite.Account.Services.Results;
using Insite.Account.WebApi.V1.ApiModels;
using Insite.Account.WebApi.V1.Mappers.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;

namespace Extensions.WebApi.GuestCheckout.Controllers
{
    [RoutePrefix("api/nbf/guestCheckout")]
    public class GuestCheckoutController : BaseApiController
    {
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;

        public GuestCheckoutController(ICookieManager cookieManager, IUnitOfWorkFactory unitOfWorkFactory)
          : base(cookieManager)
        {
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        [HttpPost]
        [Route("", Name = "UpdateGuestAccount")]
        [ResponseType(typeof(AccountModel))]
        public AccountModel Post([FromBody] GuestCheckoutParameter model)
        {
            var unitOfWork = _unitOfWorkFactory.GetUnitOfWork();
            
            var account = unitOfWork.GetRepository<UserProfile>().GetTable().FirstOrDefault(x =>
                x.Id.ToString().Equals(model.GuestId, StringComparison.CurrentCultureIgnoreCase));

            if (account != null)
            {
                account.IsGuest = false;
                account.FirstName = model.Account.FirstName;
                account.LastName = model.Account.LastName;
                account.Email = model.Account.Email;
                account.UserName = model.Account.UserName;
                unitOfWork.Save();
            }
            else
            {
                throw new Exception("Account cannot be found");
            }

            return model.Account;
        }
    }
}
