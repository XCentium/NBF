using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;
using Extensions.WebApi.Messages.Interfaces;
using Extensions.WebApi.Messages.Models;
using Extensions.WebApi.CreditCardTransaction.Models;
using Extensions.WebApi.CreditCardTransaction.Interfaces;

namespace Extensions.WebApi.CreditCardTransaction.Controllers
{
    [RoutePrefix("api/nbf/creditcardtransaction")]
    public class NBFCCTransactionController : BaseApiController
    {
        private readonly ICCTransactionService _ccService;

        public NBFCCTransactionController(ICookieManager cookieManager, ICCTransactionService ccService)
          : base(cookieManager)
        {
            _ccService = ccService;
        }

        [Route("AddCCTransaction", Name = "AddCCTransaction"), HttpPost]
        [ResponseType(typeof(string))]
        public string CreateMessage(AddCCTransactionParameter parameter)
        {
            var a = this._ccService.AddCCTransaction(parameter);

            return a.ToString();
        }
    }
}
