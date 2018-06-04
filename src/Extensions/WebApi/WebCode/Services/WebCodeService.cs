using System;
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
        [Transaction]
        public async Task<string> GetWebCodeUserID()
        {
            var result = await Task.FromResult(_webCodeRepository.GetWebCodeUserID());
            return ConvertToWebCodeUserId(result);
        }

        private string ConvertToWebCodeUserId(int id)
        {
            var chars = "ACEGHJKMNPQRTUWXYZ23456789";
            var numBase = chars.Length;
            var rem = id;

            var idLength = (int) Math.Ceiling(Math.Log(id, numBase));
            var newId = "";

            for(var i=idLength-1; i>= 0; i--)
            {
                var y = Math.Pow(numBase, i);
                var x = (int)Math.Floor(rem / y);
                newId += chars[x-1];
                rem -= (int)(x * y);
            }

            return newId;
        }
    }
}
