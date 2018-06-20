using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace Extensions.Handlers.GetProductCollectionHandler
{
    [DependencyName("NBFAfterProductListRetrived")]
    public sealed class AfterProductListRetrived : HandlerBase<GetProductCollectionParameter, GetProductCollectionResult>
    {
        public override int Order => 1100;

        public override GetProductCollectionResult Execute(IUnitOfWork unitOfWork, GetProductCollectionParameter parameter, GetProductCollectionResult result)
        {
            if (result?.Products != null && result.Products.Any())
            {
                var swatchErps = result.Products.Select(product => product.ErpNumber + ":").ToList();

                var allSwatchProducts = unitOfWork.GetRepository<Product>()
                    .GetTable()
                    .Where(x => swatchErps.Contains(x.ProductCode))
                    .Select(x => new {
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
                    var matchingSwatches = allSwatchProducts.Where(x => x.ProductCode.Equals(product.ErpNumber));
                    if (matchingSwatches.Any())
                    {
                        var swatchProductsJson = JsonConvert.SerializeObject(matchingSwatches);

                        var customProperty = new CustomProperty()
                        {
                            Name = "swatches",
                            Value = swatchProductsJson,
                            ParentTable = "Product"
                        };

                        if (product.CustomProperties.Any(x => x.Name.EqualsIgnoreCase("swatches")) == false)
                        {
                            product.CustomProperties.Add(customProperty);
                        }
                        else
                        {
                            var cp = product.CustomProperties.FirstOrDefault(x =>
                                x.Name.EqualsIgnoreCase("swatches"));
                            if (cp != null)
                            {
                                cp.Value = swatchProductsJson;
                            }
                        }
                    }
                }
            }
            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
