using System;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLooksCategory", Schema = "Extensions")]
    public class StlRoomLooksCategory : EntityBase
    {
        public Guid StlRoomLookId { get; set; }
        public Guid StlCategoryId { get; set; }
        public int? SortOrder { get; set; }
        public StlCategory StlCategory { get; set; }
        public StlRoomLook StlRoomLook { get; set; }
    }
}