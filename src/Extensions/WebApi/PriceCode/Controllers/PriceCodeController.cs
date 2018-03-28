using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.PriceCode.Interfaces;
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
        [ResponseType(typeof(string))]
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
        public async Task<IHttpActionResult> Post([FromBody] string priceCode, [FromBody] string billToId)
        {
            if (billToId.IsNullOrWhiteSpace())
            {
                return null;
            }

            var a = await _priceCodeService.GetPriceCode(billToId);

            return Ok(a);
        }
    }
}
