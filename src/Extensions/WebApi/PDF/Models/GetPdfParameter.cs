using Insite.Core.Plugins.PaymentGateway.Dtos;
using Insite.Core.Services;
using System;

namespace Extensions.WebApi.PDF.Models
{
    public class GetPdfParameter : ParameterBase
    {
        public string PageTitle { get; set; }
        public string HtmlContent { get; set; }
    }
}
