using Insite.Catalog.Services.Dtos;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookHotSpotDto
    {
        public ProductDto Product { get; set; }
        public string HotSpotPosition { get; set; }
        public int SortOrder { get; set; }
        public bool AdditionalProduct { get; set; }
        public int AdditionalProductSort { get; set; }
    }
}