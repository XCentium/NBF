using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Insite.Core.Interfaces.Data;
using Insite.Data.Entities;

namespace Extensions.Models.ShopTheLook
{
    [Table("STLCategory", Schema = "Extensions")]
    public class StlCategory : EntityBase
    {
        [Required]
        [NaturalKeyField]
        public virtual string Name { get; set; }
        public virtual string Status { get; set; }
        public virtual string Description { get; set; }
        public virtual string MainImage { get; set; }
        public virtual int SortOrder { get; set; }
        //public virtual ICollection<StlRoomLooksCategory> StlRoomLooksCategories { get; set; } = new HashSet<StlRoomLooksCategory>();
    }
}