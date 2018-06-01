using System;

namespace Extensions.WebApi.EmailApi.Models
{
    [Serializable]
    public class TaxExemptEmailDto
    {
        public string CustomerNumber { get; set; }
        public string CustomerSequence { get; set; }
        public string OrderNumber { get; set; }
        public string EmailTo { get; set; }
        public string FileName { get; set; }
        public string FileData { get; set; }
    }
}