using Extensions.WebApi.GuestActivation.Models;
using Insite.Account.WebApi.V1.ApiModels;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.GuestActivation.Interfaces
{
    public interface IGuestActivationRepository : IExtension, IDependency
    {
        AccountModel ActivateGuest(GuestActivationParameter model);
    }
}
