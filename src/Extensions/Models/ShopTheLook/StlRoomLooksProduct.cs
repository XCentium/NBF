using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLooksProduct", Schema = "Extensions")]
    public class StlRoomLooksProduct : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public Guid StlRoomLookId { get; set; }
        [Required]
        [NaturalKeyField]
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