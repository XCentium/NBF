using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;
using Extensions.WebApi.Listrak.Interfaces;
using Extensions.WebApi.Listrak.Models;
using System.Threading.Tasks;

namespace Extensions.WebApi.Listrak.Controllers
{
    [RoutePrefix("api/nbf/listrak")]
    public class ListrakController : BaseApiController
    {
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        private readonly IListrakService _listrakService;

        public ListrakController(ICookieManager cookieManager, IUnitOfWorkFactory unitOfWorkFactory, IListrakService listrakService)
          : base(cookieManager)
        {
            _listrakService = listrakService;
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        [Route("CreateMessage", Name = "sendtransactionalmessage"), HttpPost]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> SendTransationalMessage(SendTransationalMessageParameter parameter)
        {
            var a = await this._listrakService.SendTransationalMessage(parameter);

            return Ok(a);
        }
    }
}
