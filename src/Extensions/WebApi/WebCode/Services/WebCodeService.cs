using System.Threading.Tasks;
using Extensions.WebApi.WebCode.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;

namespace Extensions.WebApi.WebCode.Services
{
    public class WebcodeService : ServiceBase, IWebCodeService
    {
        private readonly IWebCodeRepository _webCodeRepository;

        public WebcodeService(IUnitOfWorkFactory unitOfWorkFactory, IWebCodeRepository webCodeRepository) : base(unitOfWorkFactory)
        {
            _webCodeRepository = webCodeRepository;
        }

        [Transaction]
        public async Task<string> GetWebCode(string siteId, string userId)
        {
            var result = await Task.FromResult(_webCodeRepository.GetWebCode(siteId, userId));
            return result;
        }
    }
}
