using System.Threading.Tasks;
using Extensions.Models.ShopTheLook;
using Extensions.WebApi.ShopTheLook.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.ShopTheLook.Services
{
    public class ShopTheLook : ServiceBase, IShopTheLookService
    {
        private readonly IShopTheLookRepository _shopTheLookRepository;

        public ShopTheLook(IUnitOfWorkFactory unitOfWorkFactory, IShopTheLookRepository webCodeRepository) : base(unitOfWorkFactory)
        {
            _shopTheLookRepository = webCodeRepository;
        }

        [Transaction]
        public async Task<StlRoomLook> GetLook(string id)
        {
            var result = await Task.FromResult(_shopTheLookRepository.GetLook(id));
            return result;
        }
    }
}
