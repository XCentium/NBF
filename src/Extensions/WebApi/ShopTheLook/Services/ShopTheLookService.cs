using System.Threading.Tasks;
using Extensions.WebApi.ShopTheLook.Interfaces;
using Extensions.WebApi.ShopTheLook.Models;
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
        public async Task<ShopTheLookDto> GetLook(string id)
        {
            var result = await Task.FromResult(_shopTheLookRepository.GetLook(id));
            return result;
        }
        [Transaction]
        public async Task<ShopTheLookCollectionDto> GetLookCollection()
        {
            var result = await Task.FromResult(_shopTheLookRepository.GetLookCollection());
            return result;
        }
    }
}
