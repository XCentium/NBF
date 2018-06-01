using Insite.Core.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Plugins.Utilities;
using Extensions.WebApi.AnalyticsPage.Interfaces;
using System.Web.Http;
using System.Threading.Tasks;
using Extensions.WebApi.AnalyticsPages.Models;
using System.Web.Http.Description;

namespace Extensions.WebApi.AnalyticsPage.Controllers
{
    [RoutePrefix("api/nbf/analyticspages")]
    public class AnalyticsPageController : BaseApiController
    {
        private readonly IAnalyticsPageService _analyticsPageService;
        public AnalyticsPageController(ICookieManager cookieManager, IAnalyticsPageService analyticsPageService) : base(cookieManager)
        {
            _analyticsPageService = analyticsPageService;
        }

        [Route("", Name = "getanalyticspages")]
        [ResponseType(typeof(IEnumerable<AnalyticsPageDto>))]
        public async Task<IHttpActionResult> Get()
        {
            var result = await _analyticsPageService.GetAnalyticsPages();
            return Ok(result);
        }
    }
}