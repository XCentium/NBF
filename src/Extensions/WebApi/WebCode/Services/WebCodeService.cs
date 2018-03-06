using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Extensions.WebApi.Listrak.Interfaces;
using Extensions.WebApi.Listrak.Models;
using Extensions.WebApi.OrderTracking.Models;
using Extensions.WebApi.WebCode.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Order.Services.Results;

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
        public async Task<string> GetWebCode(string siteId)
        {
            var result = await this._webCodeRepository.GetWebCode(siteId);
            return result;
        }
    }
}
