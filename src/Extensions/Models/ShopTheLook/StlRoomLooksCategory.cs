using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLooksCategory", Schema = "Extensions")]
    public class StlRoomLooksCategory : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public Guid StlRoomLookId { get; set; }
        [Required]
        [NaturalKeyField]
        public Guid StlCategoryId { get; set; }
        public int? SortOrder { get; set; }
        public StlCategory StlCategory { get; set; }
        public StlRoomLook StlRoomLook { get; set; }
    }
}