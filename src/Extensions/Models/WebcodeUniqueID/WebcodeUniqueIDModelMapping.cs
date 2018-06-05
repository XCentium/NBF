using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models.WebcodeUniqueID
{
    public class WebcodeUniqueIDModelMapping : EntityTypeConfiguration<WebcodeUniqueIDModel>, ICommerceContextMapping
    {
        public WebcodeUniqueIDModelMapping()
        {
            HasMany(e => e.CustomProperties)
                .WithOptional()
                .HasForeignKey(e => e.ParentId);
        }

    }
}