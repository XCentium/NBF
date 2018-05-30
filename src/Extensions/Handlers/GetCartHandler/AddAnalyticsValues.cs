using System.Linq;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;

namespace Extensions.Handlers.GetCartHandler
{
    [DependencyName(nameof(AddAnalyticsValues))]
    public class AddAnalyticsValues : HandlerBase<GetCartParameter, GetCartResult>
    {
        public override int Order => 2550;
        
        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            foreach(var line in result.CartLineResults)
            {
                var product = line.CartLine.Product;
                if (product == null) continue;
                string category, collection;
                if(product.StyleParent == null)
                {
                    category = product.Categories?.LastOrDefault()?.ShortDescription;
                    collection = product.AttributeValues?.FirstOrDefault(a => a.AttributeType.Name == "Collection")?.Value;
                }else
                {
                    category = product.StyleParent?.Categories?.LastOrDefault()?.ShortDescription;
                    collection = product.StyleParent?.AttributeValues?.FirstOrDefault(a => a.AttributeType.Name == "Collection")?.Value;
                }

                if (line.Properties.ContainsKey("category") == false)
                {
                    line.Properties.Add("category", category);
                }
                else
                {
                    line.Properties["category"] = category;
                }
                if (line.Properties.ContainsKey("collection") == false)
                {
                    line.Properties.Add("collection", collection);
                }
                else
                {
                    line.Properties["collection"] = collection;
                }
                if (line.Properties.ContainsKey("vendor") == false)
                {
                    line.Properties.Add("vendor", product.Vendor?.Name);
                }
                else
                {
                    line.Properties["vendor"] = product.Vendor?.Name;
                }
            }
            return NextHandler.Execute(unitOfWork, parameter, result); 
        }
    }
}