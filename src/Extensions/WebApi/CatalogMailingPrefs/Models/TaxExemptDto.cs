using System;
using System.IO;

namespace Extensions.WebApi.CatalogMailingPrefs.Models
{
    [Serializable]
    public class TaxExemptDto
    {
        public string customerNumber { get; set; }
        public string customerSequence { get; set; }
        public string orderNumber { get; set; }
        public string emailTo { get; set; }
        public string fileLocation { get; set; }
    }
}