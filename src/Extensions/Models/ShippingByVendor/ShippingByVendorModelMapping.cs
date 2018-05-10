using Insite.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace Extensions.Models.ShippingByVendor
{
    public class ShippingByVendorModelMapping : EntityTypeConfiguration<ShippingByVendorModel>, ICommerceContextMapping
    {
        public ShippingByVendorModelMapping()
        {
            HasMany(e => e.CustomProperties)
            .WithOptional()
            .HasForeignKey(e => e.ParentId);
        }
    }
}