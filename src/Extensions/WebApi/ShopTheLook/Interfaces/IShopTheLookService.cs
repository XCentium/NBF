﻿using System.Threading.Tasks;
using Extensions.WebApi.ShopTheLook.Models;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.ShopTheLook.Interfaces
{
    public interface IShopTheLookService : IDependency, IExtension
    {
        Task<ShopTheLookDto> GetLook(string id);
        Task<ShopTheLookCollectionDto> GetLookCollection();
    }
}
