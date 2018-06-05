using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.WebCode.Interfaces;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Microsoft.Ajax.Utilities;

namespace Extensions.WebApi.WebCode.Controllers
{
    [RoutePrefix("api/nbf/webcode")]
    public class WebCodeController : BaseApiController
    {
        private readonly IWebCodeService _webCodeService;

        public WebCodeController(ICookieManager cookieManager, IWebCodeService webCodeService)
          : base(cookieManager)
        {
            _webCodeService = webCodeService;
        }

        [Route("", Name = "getwebcode")]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> Get(string siteId, string userId)
        {
            if (siteId.IsNullOrWhiteSpace())
            {
                return null;
            }

            var a = await _webCodeService.GetWebCode(siteId, userId);

            return Ok(a);
        }
        [Route("WebCodeUniqueID", Name = "getwebcodeuniqueid")]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> Get()
        {
            
            var a = await _webCodeService.GetWebCodeUserID();

            return Ok(a);
        }
    }
}
