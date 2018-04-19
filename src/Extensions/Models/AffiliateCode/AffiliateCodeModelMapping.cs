using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.AffiliateCode
{
    public class AffiliateCodeModelMapping : EntityTypeConfiguration<AffiliateCodeModel>, ICommerceContextMapping
    {
        public AffiliateCodeModelMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);
        }
    }
}