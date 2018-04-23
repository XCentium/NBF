using System;
using System.Collections.Generic;
using Insite.Catalog.Services.Results;
using Insite.Data.Entities;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookHotSpotDto
    {
        public GetProductResult Product { get; set; }
        public string HotSpotPosition { get; set; }
        public int SortOrder { get; set; }
        public bool AdditionalProduct { get; set; }
        public int AdditionalProductSort { get; set; }
    }
}