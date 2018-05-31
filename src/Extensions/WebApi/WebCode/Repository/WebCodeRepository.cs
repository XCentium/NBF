using System.Linq;
using Extensions.Models.AffiliateCode;
using Extensions.WebApi.Base;
using Extensions.WebApi.WebCode.Interfaces;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;
using Extensions.Models.WebcodeUniqueID;
using System;
using System.Collections.Generic;

namespace Extensions.WebApi.WebCode.Repository
{
    public class WebCodeRepository : BaseRepository, IWebCodeRepository, IInterceptable
    {
        private readonly IUnitOfWork _unitOfWork;
        static Random random = new Random();

        public WebCodeRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        string IWebCodeRepository.GetWebCode(string siteId, string userId)
        {
            var webCodeId = _unitOfWork.GetRepository<AffiliateCodeModel>().GetTable()
              .FirstOrDefault(x => x.AffiliateCode.ToLower().Contains(siteId.ToLower()))?.AffiliateNumber.ToString();

            if (string.IsNullOrWhiteSpace(webCodeId))
            {
                webCodeId = _unitOfWork.GetRepository<AffiliateCodeModel>().GetTable()
                    .FirstOrDefault(x => x.AffiliateCode.ToLower().Contains("default"))?.AffiliateNumber.ToString();
            }

            if (!string.IsNullOrWhiteSpace(webCodeId))
            {
                return userId + '-' + webCodeId;
            }
            return webCodeId;
        }
        
        string IWebCodeRepository.GetWebCodeUserID()
        {
            
            IRepository<WebcodeUniqueIDModel> repository = _unitOfWork.GetRepository<WebcodeUniqueIDModel>();
            
            WebcodeUniqueIDModel userid = repository.Create();
           
            WebcodeUniqueIDModel inserted = userid;
            repository.Insert(inserted);
            _unitOfWork.Save();
            string usercodeIncremented = inserted.WebCodeUniqueID.ToString();
            int lengthOfVoucher = 7 - usercodeIncremented.Length;


            
            char[] keys = "ACEGHJKMNPQRTUWXYZ23456789".ToCharArray();
            var voucher =   GenerateWebCode(keys, lengthOfVoucher) + usercodeIncremented;

            return voucher;
        }
        private static string GenerateWebCode(char[] keys, int lengthOfVoucher)
        {
            return Enumerable
                .Range(1, lengthOfVoucher) 
                .Select(k => keys[random.Next(0, keys.Length - 1)])  
                .Aggregate("", (e, c) => e + c); 
        }

    }
}