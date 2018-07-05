using Insite.Cart.WebApi.V1.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi.Interfaces;
using Insite.Cart.Services.Results;
using Insite.Cart.WebApi.V1.ApiModels;
using System.Net.Http;

namespace Extensions.Mappers
{
    public class NbfGetCartLineMapper : GetCartLineMapper
    {
        public NbfGetCartLineMapper(ICurrencyFormatProvider currencyFormatProvider, IObjectToObjectMapper objectToObjectMapper, IUrlHelper urlHelper, IRouteDataProvider routeDataProvider) : base(currencyFormatProvider, objectToObjectMapper, urlHelper, routeDataProvider)
        {
        }

        public override CartLineModel MapResult(GetCartLineResult serviceResult, HttpRequestMessage request)
        {
            var result = base.MapResult(serviceResult, request);
            var productShipping = serviceResult.CartLine.Product.ShippingAmountOverride ?? 0;
            var totalShipping = serviceResult.CartLine.QtyOrdered * productShipping;
            result.Properties.Add("freight", totalShipping.ToString());
            return result;
        }
    }
}