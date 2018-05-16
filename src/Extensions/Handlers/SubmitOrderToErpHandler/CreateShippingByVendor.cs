using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Services.Handlers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Interfaces.Data;
using Extensions.Utility.Shipping;
using Extensions.Models.ShippingChargesRule;
using Extensions.Models.ShippingByVendor;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.EntityUtilities;

namespace Extensions.Handlers.SubmitOrderToErpHandler
{
    [DependencyName(nameof(CreateShippingByVendor))]
    public sealed class CreateShippingByVendor : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        public override int Order => 2999;
        protected readonly IOrderLineUtilities OrderLineUtilities;
        public CreateShippingByVendor(IOrderLineUtilities orderLineUtilities)
        {
            OrderLineUtilities = orderLineUtilities;
        }

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (parameter.Status.EqualsIgnoreCase("submitted"))
            {
                var additionalCharges = unitOfWork.GetRepository<ShippingChargesRuleModel>().GetTable().ToList();
                var repo = unitOfWork.GetRepository<ShippingByVendorModel>();

                var shipByVendor = ShippingHelper.CalculateShippingByVendor(additionalCharges, result.GetCartResult.Cart);
                var productsByVendor = ShippingHelper.GroupProductsByVendor(result.GetCartResult.Cart);
               
                var totalTax = result.GetCartResult.Cart.TaxAmount;
                var pretaxTotal = result.GetCartResult.OrderSubTotal + result.GetCartResult.ShippingAndHandling;

                foreach(var vendor in shipByVendor)
                {
                    var vendorTotal = vendor.TotalShippingCost + vendor.OrderLines.Sum(l => OrderLineUtilities.GetTotalNetPrice(l));
                    var vendorTax = (vendorTotal / pretaxTotal) * totalTax;
                    repo.Insert(new ShippingByVendorModel()
                    {
                        OrderNumber = result.GetCartResult.Cart.OrderNumber,
                        BaseShippingCost = vendor.BaseShippingCost,
                        AdditionalShippingCost = vendor.AdditonalCharges,
                        VendorId = vendor.VendorId,
                        ShipCode = vendor.ShipCode,
                        Tax = vendorTax                  
                    });
                }
            }

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}