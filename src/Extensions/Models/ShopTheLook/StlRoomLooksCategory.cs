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
        [NaturalKeyField(Order = 0)]
        public virtual Guid StlRoomLookId { get; set; }
        [Required]
        [NaturalKeyField(Order = 1)]
        public virtual Guid StlCategoryId { get; set; }
        public virtual int? SortOrder { get; set; }
        public virtual StlCategory StlCategory { get; set; }
        public virtual StlRoomLook StlRoomLook { get; set; }
    }
}