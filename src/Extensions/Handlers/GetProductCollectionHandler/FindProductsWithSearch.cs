using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Extensions.Handlers.GetProductCollectionHandler
{
    [DependencyName("NBFFindProductsWithSearch")]
    public sealed class FindProductsWithSearch : HandlerBase<GetProductCollectionParameter, GetProductCollectionResult>
    {
        public override int Order => 099;

        public override GetProductCollectionResult Execute(IUnitOfWork unitOfWork, GetProductCollectionParameter parameter, GetProductCollectionResult result)
        {
            parameter.IncludeSubcategories = true;
            if (parameter.Names != null && parameter.Names.Count > 0)
            {
                var attributeFilter = parameter.Names.FirstOrDefault();
                parameter.Names = null;
                var attributetypes = unitOfWork.GetRepository<AttributeType>().GetTable().Where(x => x.IsActive);
                Guid filterguid = Guid.Empty;
                AttributeType attribute = null;
                switch (attributeFilter)
                {
                    case "onsale":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("On Sale", StringComparison.CurrentCultureIgnoreCase));
                        break;
                    case "toprated":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("Top Rated", StringComparison.CurrentCultureIgnoreCase));
                        break;
                    case "shipstoday":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("Ships Today", StringComparison.CurrentCultureIgnoreCase));
                        break;
                    case "newproducts":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("New Product", StringComparison.CurrentCultureIgnoreCase));
                        break;
                    case "bestselling":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("Best Selling", StringComparison.CurrentCultureIgnoreCase));
                        break;
                    case "clearance":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("Clearance", StringComparison.CurrentCultureIgnoreCase));
                        break;
                    case "gsa":
                        attribute = attributetypes.FirstOrDefault(x => x.Name.Equals("GSA", StringComparison.CurrentCultureIgnoreCase));
                        break;
                }
                if (attribute != null)
                {
                    var attributevalues = unitOfWork.GetRepository<AttributeValue>().GetTable().Where(x => x.AttributeTypeId == attribute.Id);
                    if (attributevalues != null)
                    {
                        var av = attributevalues.FirstOrDefault(x => x.Value == "Yes");
                        if (av != null)
                        {
                            filterguid = av.Id;
                        }
                    }
                }
                if (filterguid != Guid.Empty)
                {
                    if (parameter.AttributeValueIds == null)
                    {
                        parameter.AttributeValueIds = new List<string>();
                    }
                    parameter.AttributeValueIds.Add(filterguid.ToString());

                }
            }

            //var hideAttribute = unitOfWork.GetRepository<AttributeType>().GetTable().Where(x => x.Name == "HideInSearch").FirstOrDefault();
            //if (hideAttribute != null)
            //{
            //    var attributevalue = unitOfWork.GetRepository<AttributeValue>().GetTable().Where(x => x.AttributeTypeId == hideAttribute.Id && x.Value == "No").FirstOrDefault();
            //    if (attributevalue != null)
            //    {
            //        if (parameter.AttributeValueIds == null)
            //        {
            //            parameter.AttributeValueIds = new List<string>();
            //        }
            //        parameter.AttributeValueIds.Add(attributevalue.Id.ToString());
            //    }
            //}

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
