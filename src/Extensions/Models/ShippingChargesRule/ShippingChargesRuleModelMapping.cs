using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;


namespace Extensions.Models.ShippingChargesRule
{
    public class ShippingChargesRuleModelMapping : EntityTypeConfiguration<ShippingChargesRuleModel>, ICommerceContextMapping
    {
        public ShippingChargesRuleModelMapping()
        {
            HasMany(e => e.CustomProperties)
            .WithOptional()
            .HasForeignKey(e => e.ParentId);
        }
    }
}