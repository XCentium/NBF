using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.Plugins.Cart.Models
{
    public class ProductsByVendor
    {
        public Guid? VendorId { get; set; }
        public List<OrderLine> OrderLines{ get; set; }
        public bool IsTruck { get; set; }
        public decimal? VendorTotalShippingCharges { get; set; }
    }
}