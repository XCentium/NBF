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
        [NaturalKeyField(Order = 0)]
        public virtual Guid StlRoomLookId { get; set; }
        [Required]
        [NaturalKeyField(Order = 1)]
        public virtual Guid ProductId { get; set; }
        public virtual int XPosition { get; set; }
        public virtual int YPosition { get; set; }
        public virtual int SortOrder { get; set; }
        public virtual bool AdditionalProduct { get; set; }
        public virtual int AdditionalProductSort { get; set; }
        public virtual StlRoomLook StlRoomLook { get; set; }
        public virtual Product Product { get; set; }
    }
}