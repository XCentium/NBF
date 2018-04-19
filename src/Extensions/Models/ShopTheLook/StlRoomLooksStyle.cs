using System;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLooksStyle", Schema = "Extensions")]
    public class StlRoomLooksStyle : EntityBase
    {
        public Guid StlRoomLookId { get; set; }
        public string StyleName { get; set; }
        public StlRoomLook StlRoomLook { get; set; }
        public int SortOrder { get; set; }
    }
}