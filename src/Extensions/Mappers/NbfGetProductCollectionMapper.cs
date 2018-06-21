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
    public class NbfGetProductCollectionMapper : GetProductCollectionMapper
    {
        protected readonly IUnitOfWork UnitOfWork;
        public NbfGetProductCollectionMapper(IUrlHelper urlHelper, IObjectToObjectMapper objectToObjectMapper, IUnitOfWorkFactory unitOfWorkFactory)
          : base(urlHelper, objectToObjectMapper)
        {
            UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }


        public override ProductCollectionModel MapResult(GetProductCollectionResult getProductCollectionResult, HttpRequestMessage request)
        {
            var result = base.MapResult(getProductCollectionResult, request);

            if (result?.Products != null && result.Products.Any())
            {
                var swatchErps = result.Products.Where(x => !x.ERPNumber.Contains(":")).Select(product => product.ERPNumber).ToList();

                var allSwatchProducts = UnitOfWork.GetRepository<Product>()
                    .GetTable()
                    .Where(x => swatchErps.Contains(x.ProductCode))
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

                foreach (var product in result.Products)
                {
                    var matchingSwatches = allSwatchProducts.Where(x => x.ProductCode.Equals(product.ERPNumber));
                    if (matchingSwatches.Any())
                    {
                        var swatchProductsJson = JsonConvert.SerializeObject(matchingSwatches);

                        product.Properties["swatches"] = swatchProductsJson;
                    }
                }
            }


            return result;
        }
    }
}
