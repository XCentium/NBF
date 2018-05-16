using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;
using Insite.Data.Repositories.Interfaces;
using Newtonsoft.Json;

namespace Extensions.Handlers.GetCartLineHandler
{
    [DependencyName(nameof(AddAnalyticsValues))]
    public class AddAnalyticsValues : HandlerBase<GetCartParameter, GetCartResult>
    {
        public override int Order => 2550;
        
        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            //var promotions = result.Cart.CustomerOrderPromotions;
            foreach(var line in result.CartLineResults)
            {
                var product = line.CartLine.Product;
                line.Properties.Add("Category", product.StyleParent.Categories.LastOrDefault()?.ShortDescription);
                line.Properties.Add("Collection", product.StyleParent.AttributeValues.FirstOrDefault(a => a.AttributeType.Name == "Collection" && a.IsActive)?.Value);
                line.Properties.Add("Vendor", product.Vendor.Name);

                //var promotionAmount =
                //    promotions
                //    .Where(p => p.OrderLineId == line.CartLine.Id)
                //    .Select(p => (p.PromotionResult.IsPercent ?? false && p.Promotion.IsLive ? p.PromotionResult.Amount * line.CartLine.TotalNetPrice / 100 : p.PromotionResult.Amount) ?? 0)
                //    .Sum();
                //line.Properties.Add("PromoDiscount", promotionAmount.ToString());
            }
            //var cartPromotionAmount =
            //    result.Cart.CustomerOrderPromotions
            //    .Select(p => {
            //        return (p.PromotionResult.IsPercent ?? false && p.Promotion.IsLive ? p.PromotionResult.Amount * result.OrderSubTotal / 100 : p.PromotionResult.Amount) ?? 0;
            //    })
            //    .Sum();
            //result.Properties.Add("PromoDiscount", cartPromotionAmount.ToString());
            return NextHandler.Execute(unitOfWork, parameter, result); 
        }
    }
}