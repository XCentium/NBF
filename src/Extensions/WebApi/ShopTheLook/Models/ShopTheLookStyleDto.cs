using System;
using System.Collections.Generic;

namespace Extensions.WebApi.ShopTheLook.Models
{
    public class ShopTheLookStyleDto
    {
        public Guid Id { get; set; }
        public string StyleName { get; set; }
        public int SortOrder { get; set; }
        public List<Guid> LookIds { get; set; }
    }
}