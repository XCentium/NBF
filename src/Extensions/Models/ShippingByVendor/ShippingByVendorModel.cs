using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Extensions.Models.ShippingByVendor
{
    [Table("ShippingByVendor", Schema = "Extensions")]
    public class ShippingByVendorModel : EntityBase
    {
        [Required]
        public string OrderNumber { get; set; }
        
        [Required]
        public Guid VendorId { get; set; }

        [Required]
        public decimal BaseShippingCost { get; set; }

        [Required]
        public decimal AdditionalShippingCost { get; set; }

        [Required]
        public string ShipCode { get; set; }

        [Required]
        public decimal Tax { get; set; }

    }
}