using Extensions.WebApi.AnalyticsPage.Interfaces;
using Extensions.WebApi.AnalyticsPages.Models;
using Extensions.WebApi.Base;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Catalog.Services;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;

namespace Extensions.WebApi.AnalyticsPages.Repository
{
    public class AnalyticsPagesRepository : BaseRepository, IAnalyticsPageRepository
    {
        private readonly IUnitOfWork _unitOfWork;

        public AnalyticsPagesRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService) : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
        }

        public IEnumerable<AnalyticsPageDto> GetAnalyticsPages()
        {
            var apdList = this._unitOfWork
                .GetRepository<SystemList>()
                .GetTable()
                .Where(sl => sl.Name == "Analytics Page Data")
                .FirstOrDefault();

            if(apdList == null)
            {
                throw new Exception("Could not find System List 'Analytics Page Data'");
            }

            var listId = apdList.Id;

            return _unitOfWork
                .GetRepository<SystemListValue>()
                .GetTable()
                .Where(slv => slv.SystemListId == listId)
                .Select(ConvertSystemListValueToAnalyticsPageDto)
                .Where(apd => apd != null);
        }

        private AnalyticsPageDto ConvertSystemListValueToAnalyticsPageDto(SystemListValue slv)
        {
            if(slv == null || slv.Name == null || slv.Description == null)
            {
                return null;
            }
            var url = slv.Name;
            var args = slv.Description.Split(',');
            if(args.Length < 4)
            {
                return null;
            }

            return new AnalyticsPageDto() {
                Url = url,
                PageName = args[0],
                Section = args[1],
                SubSection = args[2],
                PageType = args[3]
            };
        }
    }
}