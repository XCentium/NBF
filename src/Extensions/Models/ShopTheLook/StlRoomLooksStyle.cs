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
        [NaturalKeyField(Order = 0)]
        public virtual Guid StlRoomLookId { get; set; }
        [Required]
        [NaturalKeyField(Order = 1)]
        public virtual string StyleName { get; set; }
        public virtual StlRoomLook StlRoomLook { get; set; }
        public virtual int SortOrder { get; set; }
    }
}