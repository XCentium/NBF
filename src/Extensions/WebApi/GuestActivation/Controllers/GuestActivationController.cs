using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.GuestActivation.Interfaces;
using Extensions.WebApi.GuestActivation.Models;
using Insite.Account.WebApi.V1.ApiModels;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;

namespace Extensions.WebApi.GuestActivation.Controllers
{
    [RoutePrefix("api/nbf/guestActivation")]
    public class GuestActivationController : BaseApiController
    {
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        private readonly IGuestActivationService _guestActivationService;

        public GuestActivationController(ICookieManager cookieManager, IUnitOfWorkFactory unitOfWorkFactory, IGuestActivationService guestActivationService)
          : base(cookieManager)
        {
            _unitOfWorkFactory = unitOfWorkFactory;
            _guestActivationService = guestActivationService;
        }

        [HttpPost]
        [Route("", Name = "UpdateGuestAccount")]
        [ResponseType(typeof(AccountModel))]
        public async Task<IHttpActionResult> Post([FromBody] GuestActivationParameter model)
        {
            var a = await _guestActivationService.ActivateGuest(model);

            return Ok(a);
        }

        [Route("", Name = "CheckUserName")]
        [ResponseType(typeof(Boolean))]
        public bool Get(string userName)
        {
            var unitOfWork = _unitOfWorkFactory.GetUnitOfWork();

            var account = unitOfWork.GetRepository<UserProfile>().GetTable().FirstOrDefault(x =>
                x.UserName.Equals(userName, StringComparison.CurrentCultureIgnoreCase));

            return account != null;
        }
    }
}
