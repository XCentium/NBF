using System;

namespace Extensions.WebApi.EmailApi.Models
{
    [Serializable]
    public class ContactUsSpanishDto
    {
        public string Name { get; set; }
        public string Company { get; set; }
        public string Zip { get; set; }
        public string RequestorEmail { get; set; }
        public string RequestorPhone { get; set; }
        public string ContactMethod { get; set; }
        public string OrderNumber { get; set; }
        public string PriorityCode { get; set; }
        public string Subject { get; set; }
        public string Comments { get; set; }
        public string SendMeUpdates { get; set; }
        public string EmailTo { get; set; }
    }
}