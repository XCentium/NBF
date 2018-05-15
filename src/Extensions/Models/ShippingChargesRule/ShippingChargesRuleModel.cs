using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShippingChargesRule
{
    [Table("ShippingChargesRule", Schema = "Extensions")]
    public class ShippingChargesRuleModel : EntityBase
    {
        [Required]
        public string Type { get; set; }
        [Required]
        public int MinWeight { get; set; }
        [Required]
        public int MaxWeight { get; set; }
        public int? DeliveryCharge { get; set; }
        public int? PoundCharge { get; set; }
        public int? PricePerPound { get; set; }
        public decimal? Markup { get; set; }
    }
}