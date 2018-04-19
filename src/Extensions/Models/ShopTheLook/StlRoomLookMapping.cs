using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.ShopTheLook
{
    public class StlRoomLookMapping : EntityTypeConfiguration<StlRoomLook>, ICommerceContextMapping
    {
        public StlRoomLookMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);
        }
    }
}