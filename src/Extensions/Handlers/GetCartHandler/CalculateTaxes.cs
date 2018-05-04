using System;
using System.Linq;
using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Pipelines;
using Insite.Cart.Services.Pipelines.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.Pipelines;
using Insite.Core.Plugins.Pipelines.Pricing;
using Insite.Core.Plugins.Pipelines.Pricing.Parameters;
using Insite.Core.Plugins.Pipelines.Pricing.Results;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;

namespace Extensions.Handlers.GetCartHandler
{
    [DependencyName("CalculateTaxes")]
    public sealed class CalculateTaxes : HandlerBase<GetCartParameter, GetCartResult>
    {
        private readonly ICartPipeline _cartPipeline;
        private readonly IPricingPipeline _pricingPipeline;

        public CalculateTaxes(ICartPipeline cartPipeline, IPricingPipeline pricingPipeline)
        {
            _cartPipeline = cartPipeline;
            _pricingPipeline = pricingPipeline;
        }

        public override int Order => 1800;

        public override GetCartResult Execute(IUnitOfWork unitOfWork, GetCartParameter parameter, GetCartResult result)
        {
            if (SiteContext.Current.BillTo != null)
            {
                var cp = SiteContext.Current.BillTo.CustomProperties?.FirstOrDefault(x =>
                    x.Name.Equals("taxExemptFileName", StringComparison.CurrentCultureIgnoreCase));
                if (!string.IsNullOrEmpty(cp?.Value))
                {
                    parameter.CalculateTax = true;
                    result.Cart.RecalculateTax = true;
                    result.Cart.TaxCode1 = "TE";
                }
            }

            if (!parameter.CalculateTax)
                return NextHandler.Execute(unitOfWork, parameter, result);
            PopulateAddresses(result);
            GetCartPricingResult cartPricing = _pricingPipeline.GetCartPricing(new GetCartPricingParameter(result.Cart)
            {
                CalculateTaxes = true,
                CalculateOrderLines = false
            });
            if (cartPricing.ResultCode != ResultCode.Success)
                CopyMessages(cartPricing, result);
            return NextHandler.Execute(unitOfWork, parameter, result);
        }

        private void PopulateAddresses(GetCartResult result)
        {
            if (!result.CanModifyOrder)
                return;
            string termsCode = result.Cart.TermsCode;
            PipelineHelper.VerifyResults(_cartPipeline.SetBillTo(new SetBillToParameter()
            {
                Cart = result.Cart,
                BillTo = result.Cart.Customer
            }));
            PipelineHelper.VerifyResults(_cartPipeline.SetShipTo(new SetShipToParameter()
            {
                Cart = result.Cart,
                ShipTo = result.Cart.ShipTo
            }));
            result.Cart.TermsCode = termsCode;
        }
    }
}
