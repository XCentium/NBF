using System.Threading.Tasks;
using Extensions.WebApi.GuestActivation.Models;
using Insite.Account.WebApi.V1.ApiModels;
using Insite.Core.Interfaces.Dependency;

namespace Extensions.WebApi.GuestActivation.Interfaces
{
    public interface IGuestActivationService : IDependency, IExtension
    {
        Task<AccountModel> ActivateGuest(GuestActivationParameter model);
    }
}
