using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Services.Handlers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.Handlers.SubmitOrderToErpHandler
{
    [DependencyName(nameof(AddAffiliateData))]
    public class AddAffiliateData : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        public override int Order => 550;

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (parameter.Status.EqualsIgnoreCase("submitted"))
            {
                if (parameter.Properties.ContainsKey("UserOmnitureTransID"))
                {
                    result.GetCartResult.Cart.CustomerReference1 = parameter.Properties["UserOmnitureTransID"];
                    parameter.Properties.Remove("UserOmnitureTransID");
                }
                if (parameter.Properties.ContainsKey("CampaignID"))
                {
                    result.GetCartResult.Cart.CustomerReference2 = parameter.Properties["CampaignID"];
                    parameter.Properties.Remove("CampaignID");
                }
            }

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}