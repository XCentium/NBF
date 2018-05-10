using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.AffiliateCode
{
    [Table("AffiliateCode", Schema = "Extensions")]
    public class AffiliateCodeModel : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public int AffiliateNumber { get; set; }
        [Required]
        public string AffiliateCode { get; set; }
    }
}