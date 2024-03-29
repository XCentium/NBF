﻿using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.TaxExempt.Interfaces;
using Insite.Core.Plugins.StorageProvider;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;

namespace Extensions.WebApi.TaxExempt.Controllers
{
    [RoutePrefix("api/nbf/taxExempt")]
    public class TaxExemptController : BaseApiController
    {
        private readonly ITaxExemptService _taxExemptService;
        protected readonly IStorageProvider StorageProvider;

        public TaxExemptController(ICookieManager cookieManager,
            ITaxExemptService taxExemptService,
            IStorageProvider storageProvider)
            : base(cookieManager)
        {
            _taxExemptService = taxExemptService;
            StorageProvider = storageProvider;
        }

        [Route("addTaxExempt", Name = "addTaxExempt"), HttpGet]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> AddTaxExempt(string billToId)
        {
            await _taxExemptService.AddTaxExempt(billToId);
            return Ok();
        }

        [Route("removeTaxExempt", Name = "removeTaxExempt"), HttpGet]
        [ResponseType(typeof(string))]
        public async Task<IHttpActionResult> RemoveTaxExempt(string billToId)
        {
            await _taxExemptService.RemoveTaxExempt(billToId);
            return Ok();
        }
    }
}