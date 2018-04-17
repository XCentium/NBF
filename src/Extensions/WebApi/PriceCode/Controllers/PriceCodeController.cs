using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.PriceCode.Interfaces;
using Extensions.WebApi.PriceCode.Models;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Microsoft.Ajax.Utilities;

namespace Extensions.WebApi.PriceCode.Controllers
{
    [RoutePrefix("api/nbf/pricecode")]
    public class PriceCodeController : BaseApiController
    {
        private readonly IPriceCodeService _priceCodeService;

        public PriceCodeController(ICookieManager cookieManager, IPriceCodeService priceCodeService)
          : base(cookieManager)
        {
            _priceCodeService = priceCodeService;
        }

        [Route("", Name = "getpricecode")]
        [ResponseType(typeof(GetPriceCodeResult))]
        public async Task<IHttpActionResult> Get(string billToId)
        {
            if (billToId.IsNullOrWhiteSpace())
            {
                return null;
            }

            var a = await _priceCodeService.GetPriceCode(billToId);

            return Ok(a);
        }

        [HttpPost]
        [Route("update", Name = "setpricecode")]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> Post(SetPriceCodeRequest priceCodeRequest)
        {
            if (priceCodeRequest.BillToId.IsNullOrWhiteSpace() || priceCodeRequest.PriceCode.IsNullOrWhiteSpace())
            {
                return null;
            }

            var a = await _priceCodeService.SetPriceCode(priceCodeRequest.PriceCode, priceCodeRequest.DisplayName, priceCodeRequest.BillToId);

            return Ok(a);
        }
    }
}
