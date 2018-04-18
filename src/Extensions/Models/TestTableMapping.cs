using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.ModelConfiguration;
using Insite.Data.Interfaces;

namespace Extensions.Models
{
    public class TestTableMapping : EntityTypeConfiguration<TestTable>, ICommerceContextMapping
    {

    }
}