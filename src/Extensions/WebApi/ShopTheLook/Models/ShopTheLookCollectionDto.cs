using System.Collections.Generic;
using Extensions.Models.ShopTheLook;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookCollectionDto
    {
        public List<ShopTheLookCategoryDto> Categories { get; set; }
        public List<ShopTheLookStyleDto> Styles { get; set; }
        public List<StlRoomLook> Looks { get; set; }
    }
}