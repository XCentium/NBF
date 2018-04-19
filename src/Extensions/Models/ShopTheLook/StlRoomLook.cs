using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLook", Schema = "Extensions")]
    public class StlRoomLook : EntityBase
    {
        public string Status { get; set; }
        [Required]
        [NaturalKeyField]
        public string Title { get; set; }
        public string Description { get; set; }
        public string MainImage { get; set; }
        public int SortOrder { get; set; }
    }
}