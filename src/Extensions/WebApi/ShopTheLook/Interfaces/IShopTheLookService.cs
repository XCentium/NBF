using System.Threading.Tasks;
using Extensions.Models.ShopTheLook;
using Extensions.WebApi.ShopTheLook.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.ShopTheLook.Interfaces
{
    public interface IShopTheLookService : IDependency, IExtension
    {
        Task<StlRoomLook> GetLook(string id);
        Task<ShopTheLookCategoryDto> GetLookCollection();
    }
}
