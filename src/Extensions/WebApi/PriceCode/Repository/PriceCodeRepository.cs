using System.Threading.Tasks;
using Extensions.WebApi.Base;
using Extensions.WebApi.PriceCode.Interfaces;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;

namespace Extensions.WebApi.PriceCode.Repository
{
    public class PriceCodeRepository : BaseRepository, IPriceCodeRepository, IInterceptable
    {
        private IUnitOfWork _unitOfWork;

        public PriceCodeRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public async Task<string> GetPriceCode(string billToId)
        {
            return billToId;
        }

        public async Task<string> SetPriceCode(string priceCode, string billToId)
        {
            return billToId;
        }
    }
}