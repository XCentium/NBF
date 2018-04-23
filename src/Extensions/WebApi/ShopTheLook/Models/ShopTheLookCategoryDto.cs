using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Extensions.Models.ShopTheLook;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookCategoryDto
    {
        public List<StlRoomLooksCategory> Categories { get; set; }
        public List<StlRoomLook> Looks { get; set; }
    }
}