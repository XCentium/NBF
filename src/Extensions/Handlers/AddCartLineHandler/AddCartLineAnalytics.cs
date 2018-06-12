using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Services.Handlers;
using System.Linq;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;



namespace Extensions.Handlers.AddCartLineHandler
{
    [DependencyName(nameof(AddCartLineAnalytics))]
    public class AddCartLineAnalytics : HandlerBase<AddCartLineParameter, AddCartLineResult>
    {
        public override int Order => 1050;

        public override AddCartLineResult Execute(IUnitOfWork unitOfWork, AddCartLineParameter parameter, AddCartLineResult result)
        {
            var product = result.GetCartLineResult.CartLine.Product;
            
            if (product != null)
            {
                string category, collection;
                if (product.StyleParent == null)
                {
                    category = product.Categories?.LastOrDefault()?.ShortDescription;
                    collection = product.AttributeValues?.FirstOrDefault(a => a.AttributeType.Name == "Collection")?.Value;
                }
                else
                {
                    category = product.StyleParent?.Categories?.LastOrDefault()?.ShortDescription;
                    collection = product.StyleParent?.AttributeValues?.FirstOrDefault(a => a.AttributeType.Name == "Collection")?.Value;
                }

                if (result.Properties.ContainsKey("category") == false)
                {
                    result.Properties.Add("category", category);
                }
                else
                {
                    result.Properties["category"] = category;
                }

                if (result.Properties.ContainsKey("collection") == false)
                {
                    result.Properties.Add("collection", collection);
                }
                else
                {
                    result.Properties["collection"] = collection;
                }

                if (result.Properties.ContainsKey("vendor") == false)
                {
                    result.Properties.Add("vendor", product.Vendor?.Name);
                }
                else
                {
                    result.Properties["vendor"] = product.Vendor?.Name;
                }
            }

            return NextHandler.Execute(unitOfWork, parameter, result); 
        }
    }
}