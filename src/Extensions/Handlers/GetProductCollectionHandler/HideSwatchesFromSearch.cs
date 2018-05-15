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
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;

namespace Extensions.Handlers.GetProductCollectionHandler
{
    [DependencyName("HideSwatchesFromSearch")]
    public sealed class HideSwatchesFromSearch : HandlerBase<GetProductCollectionParameter, GetProductCollectionResult>
    {
        public HideSwatchesFromSearch(Lazy<ICatalogPipeline> catalogPipeline, Lazy<ITranslationLocalizer> translationLocalizer)
        {
        }

        public override int Order
        {
            get
            {
                return 059;
            }
        }

        public override GetProductCollectionResult Execute(IUnitOfWork unitOfWork, GetProductCollectionParameter parameter, GetProductCollectionResult result)
        {


            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
