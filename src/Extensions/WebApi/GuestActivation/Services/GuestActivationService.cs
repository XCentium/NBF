using System.Threading.Tasks;
using Extensions.WebApi.GuestActivation.Interfaces;
using Extensions.WebApi.GuestActivation.Models;
using Insite.Account.WebApi.V1.ApiModels;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.GuestActivation.Services
{
    public class GuestActivationService : ServiceBase, IGuestActivationService
    {
        private readonly IGuestActivationRepository _guestActivationRepository;

        public GuestActivationService(IUnitOfWorkFactory unitOfWorkFactory,
            IGuestActivationRepository guestActivationRepository) : base(unitOfWorkFactory)
        {
            _guestActivationRepository = guestActivationRepository;
        }

        [Transaction]
        public async Task<AccountModel> ActivateGuest(GuestActivationParameter model)
        {
            return await Task.FromResult(_guestActivationRepository.ActivateGuest(model));
        }
    }
}
