using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.WebApi.CatalogMailingPrefs.Models
{
    [Serializable]
    public class CatalogPrefsDto
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string company { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string zip { get; set; }
        public string priorityCode { get; set; }
        public string preference { get; set; }
        public string emailTo { get; set; }
    }
}