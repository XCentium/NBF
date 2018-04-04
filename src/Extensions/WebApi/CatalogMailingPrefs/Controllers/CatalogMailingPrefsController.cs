﻿using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.CatalogMailingPrefs.Interfaces;
using Extensions.WebApi.CatalogMailingPrefs.Models;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;

namespace Extensions.WebApi.CatalogMailingPrefs.Controllers
{
    [RoutePrefix("api/nbf/email")]
    public class CatalogMailingPrefsController : BaseApiController
    {
        private readonly ICatalogMailingPrefsService _CatalogMailingPrefsService;

        public CatalogMailingPrefsController(ICookieManager cookieManager, ICatalogMailingPrefsService CatalogMailingPrefsService)
          : base(cookieManager)
        {
            _CatalogMailingPrefsService = CatalogMailingPrefsService;
        }

        [Route("catalogPrefs", Name = "sendEmail")]
        [ResponseType(typeof(string))]
        [HttpPost]
        public async Task<IHttpActionResult> SendCatalogPrefsEmail([FromBody] CatalogPrefsDto catalogPrefsDto)
        {
            await _CatalogMailingPrefsService.SendEmail(catalogPrefsDto);

            return Ok();
        }
    }
}
