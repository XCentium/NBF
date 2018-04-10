using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using System;
using System.Collections.Generic;

namespace Extensions.Handlers.GetProductCollectionHandler
{
    [DependencyName("HideSwatchesFromSearch")]
    public sealed class HideSwatchesFromSearch : HandlerBase<GetProductCollectionParameter, GetProductCollectionResult>
    {
        public override int Order
        {
            get
            {
                return 650;
            }
        }

        public override GetProductCollectionResult Execute(IUnitOfWork unitOfWork, GetProductCollectionParameter parameter, GetProductCollectionResult result)
        {
            if (result.FindWithSearch)
            {
                parameter.AttributeValueIds = parameter.AttributeValueIds ?? new List<string>();
                parameter.AttributeValueIds.Add("5EA22C51-4011-E811-A98C-A3E0F1200094");
            }
            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
