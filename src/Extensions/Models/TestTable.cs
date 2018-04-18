using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using Insite.Data.Entities;

namespace Extensions.Models
{
    [Table("TestTable", Schema = "extensions")]
    public class TestTable : EntityBase
    {
        public string Column1 { get; set; }
    }
}