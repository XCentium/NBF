using Insite.Account.WebApi.V1.ApiModels;
using Insite.Core.Services;

namespace Extensions.WebApi.GuestCheckout.Models
{
    public class GuestCheckoutParameter : ParameterBase
    {
        public string GuestId { get; set; }

        public AccountModel Account { get; set; }
    }
}
