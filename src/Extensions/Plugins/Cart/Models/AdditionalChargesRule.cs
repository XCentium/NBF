using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.Plugins.Cart.Models
{
    public class AdditionalChargesRule
    {
        public string Type { get; set; }
        public int MinWeight { get; set; }
        public int MaxWeight { get; set; }
        public decimal? DeliveryCharge { get; set; }
        public decimal? PoundCharge { get; set; }
        public decimal? PricePerPound { get; set; }
        public decimal? Markup { get; set; }
        public decimal? PercentCharge { get; set; }
    }
}