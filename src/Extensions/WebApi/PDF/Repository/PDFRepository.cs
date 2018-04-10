using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Customers.Services;
using Insite.Core.Interfaces.Plugins.Security;
using Extensions.WebApi.Base;
using System;
using Insite.Core.Context;
using Insite.Data.Entities;
using Extensions.WebApi.PDF.Interfaces;
using Extensions.Handlers.Interfaces;
using Extensions.Handlers.Helpers;
using System.Threading.Tasks;
using Insite.Payments.Services;
using Extensions.WebApi.CreditCardTransaction.Models;
using Insite.Payments.Services.Parameters;
using Insite.Payments.Services.Results;
using Insite.Core.Plugins.PaymentGateway.Dtos;
using Insite.Core.Services;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Cart.Services;
using Insite.Cart.Services.Results;
using Insite.Cart.Services.Parameters;
using System.Linq;
using Extensions.WebApi.PDF.Models;
using System.IO;
using Insite.Common.Helpers;

namespace Extensions.WebApi.PDF.Repository
{
    public class PDFRepository : BaseRepository, IPDFRepository, IInterceptable
    {
        private IUnitOfWork UnitOfWork;

        public PDFRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public MemoryStream GetPdf(GetPdfParameter parameter)
        {
            var pdfStream = new MemoryStream();
            PdfGeneratorHelper.GeneratePdf(parameter.HtmlContent, pdfStream);

            return pdfStream;
        }
    }
}