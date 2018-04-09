using Extensions.WebApi.Base;
using Extensions.WebApi.WebCode.Interfaces;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;

namespace Extensions.WebApi.WebCode.Repository
{
    public class WebCodeRepository : BaseRepository, IWebCodeRepository, IInterceptable
    {
        private IUnitOfWork _unitOfWork;

        public WebCodeRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public string GetWebCode(string siteId)
        {
            return siteId;
        }
    }
}