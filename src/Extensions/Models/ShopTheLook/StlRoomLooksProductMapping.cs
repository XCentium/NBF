using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.ShopTheLook
{
    public class StlRoomLooksProductMapping : EntityTypeConfiguration<StlRoomLooksProduct>, ICommerceContextMapping
    {

        public StlRoomLooksProductMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);
            HasRequired(x => x.StlRoomLook);
            HasRequired(x => x.Product);
        }
    }
}