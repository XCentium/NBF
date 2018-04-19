using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.ShopTheLook
{
    public class StlRoomLooksStyleMapping : EntityTypeConfiguration<StlRoomLooksStyle>, ICommerceContextMapping
    {
        public StlRoomLooksStyleMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);
            HasRequired(x => x.StlRoomLook);
        }
    }
}