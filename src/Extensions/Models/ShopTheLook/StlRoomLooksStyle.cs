using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLooksStyle", Schema = "Extensions")]
    public class StlRoomLooksStyle : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public Guid StlRoomLookId { get; set; }
        [Required]
        [NaturalKeyField]
        public string StyleName { get; set; }
        public StlRoomLook StlRoomLook { get; set; }
        public int SortOrder { get; set; }
    }
}