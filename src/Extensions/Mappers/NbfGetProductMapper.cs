using System;
using System.Linq;
using System.Net.Http;
using Insite.Catalog.Services.Results;
using Insite.Catalog.WebApi.V1.ApiModels;
using Insite.Catalog.WebApi.V1.Mappers;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi.Interfaces;
using Insite.Data.Entities;
using Newtonsoft.Json;

namespace Extensions.Mappers
{
    public class NbfGetProductMapper : GetProductMapper
    {
        protected readonly IUnitOfWork UnitOfWork;
        public NbfGetProductMapper(IUrlHelper urlHelper, IObjectToObjectMapper objectToObjectMapper, IUnitOfWorkFactory unitOfWorkFactory)
          : base(urlHelper, objectToObjectMapper)
        {
            UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }
        
        public override ProductModel MapResult(GetProductResult serviceResult, HttpRequestMessage request)
        {
            var result = base.MapResult(serviceResult, request);

            if (result?.Product != null)
            {
                var allSwatchProducts = UnitOfWork.GetRepository<Product>()
                    .GetTable()
                    .Where(x => x.ProductCode.Equals(result.Product.ERPNumber))
                    .Select(x => new
                    {
                        x.ModelNumber,
                        x.Id,
                        x.ErpNumber,
                        x.Name,
                        x.ShortDescription,
                        StyleTraitId = x.ErpDescription,
                        StyleTraitValueId = x.PackDescription,
                        ImageName = x.ManufacturerItem,
                        x.ProductCode
                    })
                    .ToList();

                var matchingSwatches = allSwatchProducts.Where(x => x.ProductCode.Equals(result.Product.ERPNumber));
                if (matchingSwatches.Any())
                {
                    var swatchProductsJson = JsonConvert.SerializeObject(matchingSwatches);
                    result.Product.Properties["swatches"] = swatchProductsJson;
                }
            }
            return result;
        }
    }
}
