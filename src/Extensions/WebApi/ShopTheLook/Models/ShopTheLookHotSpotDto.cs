using Insite.Catalog.Services.Dtos;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookHotSpotDto
    {
        public ProductDto Product { get; set; }
        public string HotSpotPosition { get; set; }
        public bool IsAccessory { get; set; }
        public bool IsFeatured { get; set; }
    }
}