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

namespace Extensions.Handlers.SubmitOrderToErpHandler
{
    [DependencyName(nameof(CreateShippingByVendor))]
    public sealed class CreateShippingByVendor : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        public override int Order => 2999;

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (parameter.Status.EqualsIgnoreCase("submitted"))
            {
                var additionalCharges = unitOfWork.GetRepository<ShippingChargesRuleModel>().GetTable().ToList();
                var repo = unitOfWork.GetRepository<ShippingByVendorModel>();

                var shipByVendor = ShippingHelper.CalculateShippingByVendor(additionalCharges, result.GetCartResult.Cart);

                foreach(var vendor in shipByVendor)
                {
                    repo.Insert(new ShippingByVendorModel()
                    {
                        OrderNumber = result.GetCartResult.Cart.OrderNumber,
                        ShippingCost = vendor.ShippingCost,
                        VendorId = vendor.VendorId,
                        ShipCode = vendor.ShipCode                        
                    });
                }
            }

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}