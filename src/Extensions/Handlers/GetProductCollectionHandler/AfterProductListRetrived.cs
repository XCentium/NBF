using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Pipelines;
using Insite.Catalog.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Localization;
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
        public AfterProductListRetrived(Lazy<ICatalogPipeline> catalogPipeline, Lazy<ITranslationLocalizer> translationLocalizer)
        {
        }

        public override int Order
        {
            get
            {
                return 1100;
            }
        }

        public override GetProductCollectionResult Execute(IUnitOfWork unitOfWork, GetProductCollectionParameter parameter, GetProductCollectionResult result)
        {
            if (result != null && result.Products != null && result.Products.Any())
            {
                //foreach might be better
                foreach (var product in result.Products)
                {
                    var swatchErpNumber = product.ErpNumber + ":";

                    var swatchProducts = unitOfWork.GetRepository<Product>()
                                   .GetTable()
                                   .Where(x => x.ErpNumber.StartsWith(swatchErpNumber))
                                   .Select(x => new {x.ModelNumber,
                                       x.Id,
                                       x.ErpNumber,
                                       x.Name,
                                       x.ShortDescription,
                                       StyleTraitId = x.ErpDescription,
                                       StyleTraitValueId = x.PackDescription,
                                       ImageName = x.ManufacturerItem,
                                       ProductCode = x.ProductCode
                                   })                                   
                                   .ToList();                    

                    if (swatchProducts.Any())
                    {
                        var swatchProductsJson = JsonConvert.SerializeObject(swatchProducts);

                        var customProperty = new CustomProperty()
                        {
                            Name = "swatches",
                            Value = swatchProductsJson,
                            ParentTable = "Product"
                        };

                        if (product.CustomProperties.Any(x => x.Name == "swatches") == false)
                        {
                            product.CustomProperties.Add(customProperty);
                        }
                        else
                        {
                            var existingCustomProperty = product.CustomProperties
                                .Where(x => x.Name == "swatches")
                                .Single();

                            existingCustomProperty.Value = swatchProductsJson;
                        }
                    }
                }
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
