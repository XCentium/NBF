using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.WebcodeUniqueID
{
    [Table("WebcodeUniqueID", Schema = "Extensions")]
    public class WebcodeUniqueIDModel : EntityBase
    {
        [Required]
        [Key]
        public int WebCodeUniqueID { get; }
       
    }
}