using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLCategory", Schema = "Extensions")]
    public class StlCategory : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public string Name { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string MainImage { get; set; }
        public int SortOrder { get; set; }
    }
}