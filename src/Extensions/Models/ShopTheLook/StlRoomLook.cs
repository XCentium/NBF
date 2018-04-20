using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLRoomLook", Schema = "Extensions")]
    public class StlRoomLook : EntityBase
    {
        public virtual string Status { get; set; }
        [Required]
        [NaturalKeyField]
        public virtual string Title { get; set; }
        public virtual string Description { get; set; }
        public virtual string MainImage { get; set; }
        public virtual int SortOrder { get; set; }
        //public virtual ICollection<StlRoomLooksCategory> StlRoomLooksCategories { get; set; } = new HashSet<StlRoomLooksCategory>();
    }
}