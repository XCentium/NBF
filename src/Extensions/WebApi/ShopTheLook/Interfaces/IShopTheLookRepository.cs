using Extensions.Models.ShopTheLook;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.ShopTheLook.Interfaces
{
    public interface IShopTheLookRepository : IExtension, IDependency
    {
        StlRoomLook GetLook(string id);
    }
}
