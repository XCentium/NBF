using Insite.Catalog.Services.Dtos;
using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Pipelines;
using Insite.Catalog.Services.Pipelines.Parameters;
using Insite.Catalog.Services.Pipelines.Results;
using Insite.Catalog.Services.Results;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Plugins.Search;
using Insite.Core.Plugins.Search.Dtos;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.Data.Extensions;
using Insite.Data.Repositories.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;

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

                    var swatchProductsQuery = unitOfWork.GetRepository<Product>()
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

                    var swatchProducts = swatchProductsQuery
                        .Select(x => x.ModelNumber)
                        .Distinct()
                        .OrderBy(x => x)
                        .ToDictionary(x => x, x => swatchProductsQuery
                                                   .Where(t => t.ModelNumber == x)                                               
                                                   .Select(t => new
                                                   {
                                                       t.Id,
                                                       t.ErpNumber,
                                                       t.Name,
                                                       t.ShortDescription,
                                                       StyleTraitId = t.StyleTraitId,
                                                       StyleTraitValueId = t.StyleTraitValueId,
                                                       ImageName = t.ImageName,
                                                       ProductCode = t.ProductCode
                                                   }));

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
