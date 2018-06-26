using Insite.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace Extensions.Models.StaticCategory
{
    public class StaticCategoryMapping : EntityTypeConfiguration<StaticCategory>, ICommerceContextMapping
    {
        public StaticCategoryMapping()
        {
            HasMany(e => e.CustomProperties)
            .WithOptional()
            .HasForeignKey(e => e.ParentId);
        }
    }
}