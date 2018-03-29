using Extensions.Enums.Listrak;
using Insite.Core.Services;
using System.Collections.Generic;

namespace Extensions.WebApi.Listrak.Models
{
    public class CreateOrUpdateContactParameter : ParameterBase
    {
        public CreateOrUpdateContactParameter() { }
        public string EventId { get; set; }
        public bool SubscribedByContact { get; set; }
        public bool OverrideUnsubscribe { get; set; }
        public string EmailAddress { get; set; }
        public string SubscriptionState { get; set; }
    }
}