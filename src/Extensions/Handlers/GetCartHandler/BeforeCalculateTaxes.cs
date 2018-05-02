// Decompiled with JetBrains decompiler
// Type: Insite.Cart.Services.Handlers.GetCartHandler.BeforeCalculateTaxes
// Assembly: Insite.Cart, Version=4.3.2.38010, Culture=neutral, PublicKeyToken=null
// MVID: 94F0337A-6F12-4473-8524-2C3FECEA129A
// Assembly location: E:\NBF\insite-commerce-cloud-master\src\InsiteCommerce.Web\bin\Insite.Cart.dll

using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using System;
using System.Linq;

namespace Insite.Cart.Services.Handlers.GetCartHandler
{
    [DependencyName("BeforeCalculateTaxes")]
    public sealed class BeforeCalculateTaxes : HandlerBase<GetCartParameter, GetCartResult>
    {
        private readonly Lazy<ICustomerOrderUtilities> customerOrderUtilities;
        private readonly IPricingPipeline pricingPipeline;

        public BeforeCalculateTaxes(Lazy<ICustomerOrderUtilities> customerOrderUtilities, IPricingPipeline pricingPipeline)
        {
            this.customerOrderUtilities = customerOrderUtilities;
            this.pricingPipeline = pricingPipeline;
        }

        public override int Order
        {
            get
            {
                return 1799;
            }
        }

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            if (!parameter.CalculateTax)
                return this.NextHandler.Execute(unitOfWork, parameter, result);

            if (SiteContext.Current.BillTo != null)
            {
                var cp = SiteContext.Current.BillTo.CustomProperties?.FirstOrDefault(x =>
                    x.Name.Equals("taxExemptFileName", StringComparison.CurrentCultureIgnoreCase));

                //if (cp != null && cp.Value == "GSA")
                //{
                //    parameter.CalculateTax = false;
                //}

                if (cp != null && !string.IsNullOrEmpty(cp.Value) && !string.IsNullOrWhiteSpace(cp.Value))
                {
                    parameter.CalculateTax = false;
                }
            }

            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
