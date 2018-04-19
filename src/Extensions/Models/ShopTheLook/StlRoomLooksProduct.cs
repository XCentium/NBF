using System;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLooksProduct", Schema = "Extensions")]
    public class StlRoomLooksProduct : EntityBase
    {
        public Guid StlRoomLookId { get; set; }
        public Guid ProductId { get; set; }
        public int XPosition { get; set; }
        public int YPosition { get; set; }
        public int SortOrder { get; set; }
        public bool AdditionalProduct { get; set; }
        public int AdditionalProductSort { get; set; }
        public StlRoomLook StlRoomLook { get; set; }
        public Product Product { get; set; }
    }
}