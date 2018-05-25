using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.WebcodeUniqueID
{
    [Table("WebcodeUnqiueID", Schema = "Extensions")]
    public class WebcodeUniqueIDModel : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public int AffiliateNumber { get; set; }
    }
}