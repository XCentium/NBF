using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Customers.Services;
using Insite.Core.Interfaces.Plugins.Security;
using Extensions.WebApi.Base;
using Extensions.WebApi.Listrak.Models;
using System;
using Insite.Core.Context;
using Insite.Data.Entities;
using Extensions.WebApi.Listrak.Interfaces;
using Extensions.Handlers.Interfaces;
using Extensions.Handlers.Helpers;
using System.Threading.Tasks;

namespace Extensions.WebApi.Listrak.Repository
{
    public class ListrakRepository : BaseRepository, IListrakRepository, IInterceptable
    {
        private const bool IgnoreCase = true;
        private IUnitOfWork UnitOfWork;
        protected readonly Lazy<INbfListrakHelper> GetListrakHelper;

        public ListrakRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService, Lazy<INbfListrakHelper> getListrakHelper)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.GetListrakHelper = getListrakHelper;
        }

        public async Task<bool> SendTransactionalEmail(SendTransationalMessageParameter parameter)
        {

            var a = await this.GetListrakHelper.Value.SendTransactionalEmail(parameter);
            return a;
        }
    }
}