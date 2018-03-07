using System;
using System.Linq;
using System.Threading.Tasks;
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

        public async Task<string> GetWebCode(string siteId)
        {
            var random = new Random();

            const string chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
            return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());

            return "16735";
        }
    }
}