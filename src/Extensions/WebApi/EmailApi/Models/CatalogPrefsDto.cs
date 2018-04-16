using System;

namespace Extensions.WebApi.EmailApi.Models
{
    [Serializable]
    public class CatalogPrefsDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Title { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string PriorityCode { get; set; }
        public string Preference { get; set; }
        public string EmailTo { get; set; }
        public string RequestorEmail { get; set; }
        public string RequestorPhone { get; set; }
        public bool SendMeUpdates { get; set; }
    }
}