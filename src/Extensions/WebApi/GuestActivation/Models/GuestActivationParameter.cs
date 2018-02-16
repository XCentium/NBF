using Insite.Account.WebApi.V1.ApiModels;
using Insite.Core.Services;

namespace Extensions.WebApi.GuestActivation.Models
{
    public class GuestActivationParameter : ParameterBase
    {
        public string GuestId { get; set; }

        public AccountModel Account { get; set; }
    }
}
