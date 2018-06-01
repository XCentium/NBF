using System;
using System.Collections.Generic;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string MainImage { get; set; }
        public int SortOrder { get; set; }
        public List<Guid> LookIds { get; set; }
    }
}