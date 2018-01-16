using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.WebApi;
using NBF.Customizations.Lib.Api.Content.Interfaces;
using NBF.Customizations.Lib.Api.Content.Models;
using Insite.Core.Plugins.Utilities;
using System.Collections.Generic;

namespace NBF.Customizations.Lib.Api.Content.WebApi
{
    [RoutePrefix("api/v1/content")]
    public class ContentController : BaseApiController
    {
        private readonly IContentService _contentService;


        public ContentController(ICookieManager cookieManager, IContentService contentService)
            : base(cookieManager)
        {
            _contentService = contentService;
        }


        //[ResponseType(typeof(List<string>)), Route("getcontenttags")]

        [Route("", Name = "getcontenttagsV1")]
        public async Task<IHttpActionResult> Get()
        {
            var m = await _contentService.GetContentTags();
            return Ok(m);
        }
    }
}