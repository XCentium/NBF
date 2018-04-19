using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.ShopTheLook.Interfaces;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Microsoft.Ajax.Utilities;

namespace Extensions.WebApi.ShopTheLook.Controllers
{
    [RoutePrefix("api/nbf/shopthelook")]
    public class ShopTheLookController : BaseApiController
    {
        private readonly IShopTheLookService _shopTheLookService;

        public ShopTheLookController(ICookieManager cookieManager, IShopTheLookService shopTheLookService)
          : base(cookieManager)
        {
            _shopTheLookService = shopTheLookService;
        }

        [Route("{id}", Name = "getLook")]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> Get(string id)
        {
            if (id.IsNullOrWhiteSpace())
            {
                return null;
            }

            var a = await _shopTheLookService.GetLook(id);

            return Ok(a);
        }
    }
}
