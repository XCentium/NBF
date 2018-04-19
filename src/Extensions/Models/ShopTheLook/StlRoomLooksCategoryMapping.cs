using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.ShopTheLook
{
    public class StlRoomLooksCategoryMapping : EntityTypeConfiguration<StlRoomLooksCategory>, ICommerceContextMapping
    {
        public StlRoomLooksCategoryMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);

            HasRequired(x => x.StlCategory);
            HasRequired(x => x.StlRoomLook);
        }
    }
}