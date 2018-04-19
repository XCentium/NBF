using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.ShopTheLook
{
    public class StlCategoryMapping : EntityTypeConfiguration<StlCategory>, ICommerceContextMapping
    {
        public StlCategoryMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);
        }
    }
}