using System.Linq;
using Extensions.Models.ShopTheLook;
using Extensions.WebApi.Base;
using Extensions.WebApi.ShopTheLook.Interfaces;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;

namespace Extensions.WebApi.ShopTheLook.Repository
{
    public class ShopTheLookRepository : BaseRepository, IShopTheLookRepository, IInterceptable
    {
        private readonly IUnitOfWork _unitOfWork;

        public ShopTheLookRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public StlRoomLook GetLook(string id)
        {
            var stls1 = _unitOfWork.GetRepository<StlRoomLook>().GetTable().ToList();
            var stls2 = _unitOfWork.GetRepository<StlCategory>().GetTable().ToList();
            var stls3 = _unitOfWork.GetRepository<StlRoomLooksCategory>().GetTable().ToList();
            var stls4 = _unitOfWork.GetRepository<StlRoomLooksProduct>().GetTable().ToList();
            var stls5 = _unitOfWork.GetRepository<StlRoomLooksStyle>().GetTable().ToList();

            return stls1.FirstOrDefault();
        }
    }
}