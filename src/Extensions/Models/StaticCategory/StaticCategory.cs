using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Extensions.Models.StaticCategory
{
    [Table("StaticCategory", Schema = "Extensions")]
    public class StaticCategory : EntityBase
    {
        public Guid? ParentId { get; set; }
        [Required]
        public string Name { get; set; }
        public string MetaDescription { get; set; }
        public string MetaKeyword { get; set; }
        [Required]
        public string UrlSegment { get; set; }
        [Required]
        public int Order { get; set; }
        [Required]
        public bool ByArea { get; set; }
    }
}