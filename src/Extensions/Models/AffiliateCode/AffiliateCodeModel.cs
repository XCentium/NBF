using System.ComponentModel.DataAnnotations.Schema;
using Insite.Data.Entities;

namespace Extensions.Models.AffiliateCode
{
    [Table("AffiliateCode", Schema = "Extensions")]
    public class AffiliateCodeModel : EntityBase
    {
        public int AffiliateId { get; set; }
        public string AffiliateCode { get; set; }
    }
}