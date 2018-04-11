using System;

namespace Extensions.WebApi.EmailApi.Models
{
    [Serializable]
    public class TaxExemptDto
    {
        public string CustomerNumber { get; set; }
        public string CustomerSequence { get; set; }
        public string OrderNumber { get; set; }
        public string EmailTo { get; set; }
        public string FileLocation { get; set; }
    }
}